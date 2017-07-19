# ts-node-iptc

[![npm version](https://badge.fury.io/js/ts-node-iptc.svg)](https://badge.fury.io/js/ts-node-iptc)
[![Build Status](https://travis-ci.org/bpatrik/ts-node-iptc.svg?branch=master)](https://travis-ci.org/bpatrik/ts-node-iptc)

This module is based on the node-iptc: https://github.com/derekbaron/node-iptc
The reason of this module is that node-iptc did not accept pull requests and does not have typescript type definitions available.

This module extracts IPTC information from JPEG files. 
IPTC is (mostly non-technical) structured metadata about the image with fields like creator/artist, copyright, keywords, category, etc.  
For more information, see: http://www.adobe.com/devnet-apps/photoshop/fileformatashtml/#50577409_38034

## Installation

Installing using npm:

    npm install ts-node-iptc
    
## Example

```typescript
  import {IptcParser} from "ts-node-iptc";
  
  fs.readFile("myImage.jpeg", function(err, data) {
      if (err) { throw err }
      try{
       let iptcData = IptcParser.parse(data);
       }catch(err){
        //TODO: handle exception
       }
    });
```

Sample output
```
{
   "by_line": [
     "Ralf Roletschek"
   ],
   "date_created": "20111119",
   "time_created": "195544+0000",
   "copyright_notice": "(C) Ralf Roletschek",
   "date_time": "2011-12-19T19:55:44.000Z"
 }
```

Supported tags:
```typescript

  object_type_reference?: string;
  object_attribute_reference?: string;
  object_name?: string;
  edit_status?: string;
  editorial_update?: string;
  urgency?: string;
  subject_reference?: string;
  category?: string;
  supplemental_categories?: string[];
  fixture_id?: string[];
  keywords?: string[];
  content_location_code?: string[];
  content_location_name?: string[];
  release_date?: string;
  release_time?: string;
  expiration_date?: string;
  expiration_time?: string;
  special_instructions?: string;
  action_advised?: string;
  reference_service?: string[];
  reference_date?: string[];
  reference_number?: string[];
  date_created?: string;
  time_created?: string;
  digital_date_created?: string;
  digital_time_created?: string;
  originating_program?: string;
  program_version?: string;
  object_cycle?: string;
  by_line?: string[];
  caption?: string;   // not in spec, but observed in situ
  by_line_title?: string[];
  city?: string;
  sub_location?: string;
  province_or_state?: string;
  country_or_primary_location_code?: string;
  country_or_primary_location_name?: string;
  original_transmission_reference?: string;
  headline?: string;
  credit?: string;
  source?: string;
  copyright_notice?: string;
  contact?: string;
  local_caption?: string;
  caption_writer?: string[];
  rasterized_caption?: string;
  image_type?: string;
  image_orientation?: string;
  language_identifier?: string;
  audio_type?: string;
  audio_sampling_rate?: string;
  audio_sampling_resolution?: string;
  audio_duration?: string;
  audio_outcue?: string;

  job_id?: string;
  master_document_id?: string;
  short_document_id?: string;
  unique_document_id?: string;
  owner_id?: string;

  object_preview_file_format?: string;
  object_preview_file_format_version?: string;
  object_preview_data?: string;
  date_time?:Date;
```
