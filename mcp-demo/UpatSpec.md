### UPAT
POST http://upatx.ltc:3000/v2/api/patent_search
Content-Type: application/json
Cache-Control: no-cache

{
  "clientInfo": {
    "ip": "127.0.0.1",
    "userName": "Jason"
  },
  "query": "TAC:(LED)",
  "from": 0,
  "size": 1,
  "countries": [
    "TW"
  ]
}


HTTP/1.1 200 OK
connection: close
content-length: 688
content-type: application/json; charset=utf-8
date: Mon, 12 Jan 2026 06:34:02 GMT
vary: Accept-Encoding

{
  "total": 40142,
  "hits": [
    {
      "pubDate_issued": "2005-09-11",
      "title_issued": "LED燈泡之LED燈佈置結構",
      "title_en_issued": "LED LIGHT OF LED BULB ASSIGNS THE STRUCTURE",
      "kindCode_issued": null,
      "pnRaw_issued": "M275347",
      "apd_issued": "2005-03-16",
      "docKind_issued": [
        "issued"
      ],
      "apnRaw_issued": "094204077",
      "database": "TW",
      "isIssued": true,
      "_index": "pat_tw_2005_v15",
      "id": "tw_M275347_0094204077",
      "_score": 55.391685
    }
  ],
  "took": 296,
  "timed_out": false,
  "_shards": {
    "total": 30,
    "successful": 30,
    "skipped": 0,
    "failed": 0
  },
  "statusCode": 1200,
  "status": "ok",
  "aggs": {},
  "esQueryString": "(title:(LED) OR title_en:(LED) OR abstract:(LED) OR abstract_en:(LED) OR claims:(LED) OR claims_en:(LED))",
  "esDataPostProcessTook": 0
}