/*
 See: http://www.adobe.com/devnet-apps/photoshop/fileformatashtml/#50577409_38034
 IPTC application marker is "Photoshop 3.0"
 Signature is '8BIM' Type is 0x0404

 IMAGE RESOURCE BLOCKS:
 Length    Description
 4         Signature: '8BIM'
 2         Unique identifier for the resource. Image resource IDs contains a list of resource IDs used by Photoshop.
 Variable  Name: Pascal string, padded to make the size even (a null name consists of two bytes of 0)
 4         Actual size of resource data that follows
 Variable  The resource data, described in the sections on the individual resource types. It is padded to make the size even.

 */


import {fieldMap} from "./IptcFieldMap";
import {IptcData} from "./IptcData";
const field_delimiter = 28;
const text_start_marker = 2;

export interface BufferType {
  length: number;
  readUInt16BE(_: number): number;
  readInt16BE(_: number): number;
  readInt32BE(_: number): number;
  slice(a: number, b: number): BufferType;
  toString(_: string): string;
}

export class IptcParser {
  /**
   *
   * @param buffer
   * @returns {IptcData}
   * @throws string
   */
  public static parse(buffer: BufferType): IptcData {
    // check for jpeg magic bytes header
    if (buffer[0] != 0xFF || buffer[1] != 0xD8) {
      throw "not a jpeg"; // it is not a valid jpeg
    }

    let offset = 2;
    // Loop through the file looking for the photoshop header bytes
    while (offset < buffer.length) {
      if (buffer[offset] != 0xFF) {
        throw "Not a valid marker at offset " + offset + ", found: " + buffer[offset];
      }

      let applicationMarker = buffer[offset + 1];

      if (applicationMarker == 237) {
        // This is our marker. The content length is 2 byte number.
        return IptcParser.readIPTCData(buffer, offset + 4, buffer.readUInt16BE(offset + 2));
      }
      else {
        // Add header length (2 bytes after header type) to offset
        offset += 2 + buffer.readUInt16BE(offset + 2);
      }
    }
  }


  private static readIPTCData(buffer: BufferType, start: number, length: number): IptcData {
    const data: IptcData = {};

    if (buffer.slice(start, start + 13).toString("utf-8") != "Photoshop 3.0") {
      throw "Not valid Photoshop data: " + buffer.slice(start, start + 13).toString("utf-8");
    }

    // There are tons of other potentially useful blocks that could be processed here
    // but are currently discarded.
    this.extractBlocks(buffer, start + 13, length).forEach((block) => {
      // Process IPTC-NAA block 0x0404 (1028)
      if (block.resourceId == 1028) {
        //console.log(block)
        const fields = IptcParser.extractIPTCFieldsFromBlock(buffer, block.startOfBlock, block.sizeOfBlock);
        let date, time;

        fields.forEach((field) => {

          //console.log(field)
          if (field.id in fieldMap) {
            if (field.id == 55) date = field.value;
            if (field.id == 60) time = field.value;

            const name = fieldMap[field.id].name.toLowerCase();
            const val = field.value;


            if (fieldMap[field.id].repeatable) {
              if (name in data) {
                data[name].push(val);
              }
              else {
                data[name] = [val];
              }
            }
            else {
              data[name] = val;
            }
          }
        });

        // Construct a real datetime
        if (date && time) {
          try {
            data['date_time'] = new Date(Date.UTC(
              parseInt(date.slice(0, 4)),
              parseInt(date.slice(4, 6)),
              parseInt(date.slice(6, 8)),
              parseInt(time.slice(0, 2)),
              parseInt(time.slice(2, 4)),
              parseInt(time.slice(4, 6)),
              0
            ));

          }
          catch (dateErr) {
            console.log(dateErr);
          }
        }
      }
    });

    return data;
  }

  private static extractIPTCFieldsFromBlock(buffer: BufferType, start: number, length: number): { id: number, value: string }[] {
    const end = Math.min(buffer.length, start + length);
    const data = [];

    for (let i = start; i < end; i++) {
      if (buffer[i] == text_start_marker) {

        // Get the length by finding the next field seperator
        let length = 0;
        while (
        i + length < end &&
        buffer[i + length] != field_delimiter &&
        (length < 4 || buffer[i + length + 1] != text_start_marker)) {
          length++;
        }

        //console.log(buffer[i + 1] + ' - ' + length)
        if (length == 0) continue;

        // Convert bytes to string and yield
        data.push({
          id: buffer[i + 1],
          value: buffer.slice(i + 4, i + 4 + length - 4).toString("utf-8")
        });
        i += length - 1;
      }
    }

    return data;
  }

  private static extractBlocks(buffer: BufferType, start: number, length: number): {
    resourceId: number,
    name: string,
    startOfBlock: number,
    sizeOfBlock: number
  }[] {

    const blocks = [];
    const end = Math.min(buffer.length, start + length);

    for (let i = start; i < end; i++) {
      // Signature: '8BIM'
      if (buffer[i] == 56
        && buffer[i + 1] == 66
        && buffer[i + 2] == 73
        && buffer[i + 3] == 77) {

        // Resource ID is 2 bytes, so use u16BE
        const resourceId = buffer.readInt16BE(i + 4);
        // Name: Pascal string, padded to make the size even
        let nameLength = 2;
        // Search for the end of a null-terminated string
        while (nameLength < end - i && buffer[i + 6 + nameLength] != 0x0) {
          nameLength++;
        }

        const name = buffer.slice(i + 6, i + 6 + nameLength).toString("utf-8");

        const blockSize = buffer.readInt32BE(i + 6 + nameLength);

        blocks.push({
          resourceId: resourceId,
          name: name,
          startOfBlock: i + 6 + nameLength + 2,
          sizeOfBlock: blockSize + 2
        });
      }
    }
    return blocks;
  }

}
