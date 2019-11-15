#!/bin/sh

dirname="/Users/nakagawa/Project/2019-Nyobi/part-02-10/niconico-ranking-rss"
mkdir -p ${dirname}
filename="${dirname}/hourly-ranking-`date +'%Y%m%d%H%M'`.xml"
echo "Save to $filename"
curl -s -o $filename -H "User-Agent: CrawlBot; your@mail" https://www.nicovideo.jp/ranking/genre/all?rss=2.0&lang=ja-jp