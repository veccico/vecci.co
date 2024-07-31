rm -rf s3_bucket
mkdir s3_bucket
cp -r ./* s3_bucket
rm s3_bucket/deploy_s3.sh
rm -rf s3_bucket/.git

# find s3_bucket/blog -mindepth 1 -maxdepth 1 -type d | while read dir; do
#     rm -rf $dir
# done

aws s3 sync s3_bucket s3://vecci.co --delete
aws cloudfront create-invalidation --distribution-id E272S1OA8NF1D --paths "/*"

rm -rf s3_bucket
