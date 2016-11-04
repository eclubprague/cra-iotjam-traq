#!/bin/bash



# curl \
#   -X GET \
#   -H 'Content-Type: *' \
#   --get 'https://route.cit.api.here.com/routing/7.2/getlinkinfo.json' \
#     --data-urlencode 'linkids=-1022064900,-704620835' \
#     --data-urlencode "$1" \
#     --data-urlencode "$2"



# curl \
#   -X GET \
#   -H 'Content-Type: *' \
#   --get 'https://reverse.geocoder.cit.api.here.com/6.2/reversegeocode.json' \
#     --data-urlencode 'pos=37.7849507,-122.4211569,80' \
#     --data-urlencode 'mode=trackPosition' \
#     --data-urlencode 'gen=9' \
    # --data-urlencode "$1" \
    # --data-urlencode "$2"


curl \
  -X POST \
  -H 'Content-Type: *' \
  -d '<?xml version="1.0"?>
<gpx version="1.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.topografix.com/GPX/1/0" xsi:schemaLocation="http://www.topografix.com/GPX/1/0 http://www.topografix.com/GPX/1/0/gpx.xsd">
  <trk>
       <trkseg>
      <trkpt lat="49.40379670" lon="13.77576110">
        <ele>504.00000</ele>
        <time>2010-01-01T00:00:00Z</time>
      </trkpt>
      <trkpt lat="49.40380000" lon="13.77570000">
        <ele>504.00000</ele>
        <time>2010-01-01T00:00:01Z</time>
      </trkpt>
      <trkpt lat="49.40334000" lon="13.77552000">
        <ele>508.00000</ele>
        <time>2010-01-01T00:00:20Z</time>
      </trkpt>
      <trkpt lat="49.40315000" lon="13.77516000">
        <ele>512.00000</ele>
        <time>2010-01-01T00:00:32Z</time>
      </trkpt>
      <trkpt lat="49.40300000" lon="13.77507000">
        <ele>514.00000</ele>
        <time>2010-01-01T00:00:39Z</time>
      </trkpt>
      <trkpt lat="49.40268000" lon="13.77498000">
        <ele>514.00000</ele>
        <time>2010-01-01T00:00:52Z</time>
      </trkpt>
      <trkpt lat="49.40256000" lon="13.77498000">
        <ele>514.00000</ele>
        <time>2010-01-01T00:00:56Z</time>
      </trkpt>
      <trkpt lat="49.40241000" lon="13.77499000">
        <ele>513.00000</ele>
        <time>2010-01-01T00:01:02Z</time>
      </trkpt>
      <trkpt lat="49.40182000" lon="13.77458000">
        <ele>511.00000</ele>
        <time>2010-01-01T00:01:28Z</time>
      </trkpt>
      <trkpt lat="49.40075000" lon="13.77452000">
        <ele>509.00000</ele>
        <time>2010-01-01T00:02:11Z</time>
      </trkpt>
      <trkpt lat="49.40074000" lon="13.77452000">
        <ele>509.00000</ele>
        <time>2010-01-01T00:02:12Z</time>
      </trkpt>
      <trkpt lat="49.39951000" lon="13.77445000">
        <ele>511.00000</ele>
        <time>2010-01-01T00:03:01Z</time>
      </trkpt>
      <trkpt lat="49.39854000" lon="13.77450000">
        <ele>509.00000</ele>
        <time>2010-01-01T00:03:40Z</time>
      </trkpt>
      <trkpt lat="49.39830000" lon="13.77451000">
        <ele>508.00000</ele>
        <time>2010-01-01T00:03:49Z</time>
      </trkpt>
      <trkpt lat="49.39793000" lon="13.77471000">
        <ele>505.00000</ele>
        <time>2010-01-01T00:04:05Z</time>
      </trkpt>
      <trkpt lat="49.39723000" lon="13.77551000">
        <ele>500.00000</ele>
        <time>2010-01-01T00:04:40Z</time>
      </trkpt>
      <trkpt lat="49.39681000" lon="13.77596000">
        <ele>500.00000</ele>
        <time>2010-01-01T00:05:00Z</time>
      </trkpt>
      <trkpt lat="49.39631000" lon="13.77675000">
        <ele>496.00000</ele>
        <time>2010-01-01T00:05:29Z</time>
      </trkpt>
      <trkpt lat="49.39588000" lon="13.77724000">
        <ele>493.00000</ele>
        <time>2010-01-01T00:05:51Z</time>
      </trkpt>
      <trkpt lat="49.39499000" lon="13.77739000">
        <ele>499.00000</ele>
        <time>2010-01-01T00:06:26Z</time>
      </trkpt>
      <trkpt lat="49.39404000" lon="13.77756000">
        <ele>496.00000</ele>
        <time>2010-01-01T00:07:05Z</time>
      </trkpt>
      <trkpt lat="49.39402000" lon="13.77754000">
        <ele>496.00000</ele>
        <time>2010-01-01T00:07:06Z</time>
      </trkpt>
      <trkpt lat="49.39402000" lon="13.77753000">
        <ele>496.00000</ele>
        <time>2010-01-01T00:07:06Z</time>
      </trkpt>
      <trkpt lat="49.39312000" lon="13.77680000">
        <ele>500.00000</ele>
        <time>2010-01-01T00:07:47Z</time>
      </trkpt>
      <trkpt lat="49.39294000" lon="13.77656000">
        <ele>501.00000</ele>
        <time>2010-01-01T00:07:56Z</time>
      </trkpt>
      <trkpt lat="49.39285000" lon="13.77628000">
        <ele>502.00000</ele>
        <time>2010-01-01T00:08:04Z</time>
      </trkpt>
      <trkpt lat="49.39285000" lon="13.77627000">
        <ele>502.00000</ele>
        <time>2010-01-01T00:08:05Z</time>
      </trkpt>
      <trkpt lat="49.39275000" lon="13.77595000">
        <ele>503.00000</ele>
        <time>2010-01-01T00:08:14Z</time>
      </trkpt>
      <trkpt lat="49.39247000" lon="13.77470000">
        <ele>505.00000</ele>
        <time>2010-01-01T00:08:48Z</time>
      </trkpt>
      <trkpt lat="49.39225000" lon="13.77416000">
        <ele>506.00000</ele>
        <time>2010-01-01T00:09:05Z</time>
      </trkpt>
      <trkpt lat="49.39178000" lon="13.77399000">
        <ele>506.00000</ele>
        <time>2010-01-01T00:09:24Z</time>
      </trkpt>
      <trkpt lat="49.39111000" lon="13.77400000">
        <ele>508.00000</ele>
        <time>2010-01-01T00:09:51Z</time>
      </trkpt>
    </trkseg>

  </trk>
</gpx>' \
  'http://rme.cit.api.here.com/2/matchroute.json?routemode=car&'$1'&'$2

