// const aws=require('aws-sdk')

// aws.config.update({
//     accessKeyId: "AKIAY3L35MCRZNIRGT6N",
//     secretAccessKey: "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",
//     region: "ap-south-1"
// })

// const uploadFile=async function(file){
//     return new Promise(function(resolve,reject){

//         let s3= new aws.S3({apiVersion: '2006-03-01'});

//         let uploadParams={
//             ACL:"public-read",
//             Bucket:"classroom-training-bucket",
//             Key:"voosh-assignment/"+file.originalname,
//             Body:file.buffer
//         }

//         s3.upload(uploadParams,function(err,data){
//             if(err){
//                 return reject({"error":err})
//             }
//             return resolve(data.Location)

//         })

//     })
// }


// module.exports={uploadFile}



const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { fromIni } = require("@aws-sdk/credential-provider-ini");

// Set AWS configuration
const credentials = fromIni({
    accessKeyId: "AKIAY3L35MCRZNIRGT6N",
    secretAccessKey: "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"
});

const region = "ap-south-1";

const s3Client = new S3Client({ region, credentials });

const uploadFile = async function (file) {
    try {
        const uploadParams = {
            Bucket: "classroom-training-bucket",
            Key: "voosh-assignment/" + file.originalname,
            Body: file.buffer,
            ACL: "public-read"
        };

        const data = await s3Client.send(new PutObjectCommand(uploadParams));
        return data.Location;
    } catch (err) {
        console.error("Error uploading file to S3:", err);
        throw { error: err };
    }
};

module.exports = { uploadFile };
