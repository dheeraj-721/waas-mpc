const ffi = require("ffi-napi");
const { Storage } = require('@google-cloud/storage');
const fs = require('fs');
const path = require('path');
const os = require('os');

const storage = new Storage();
const bucketName = 'kpmg_dev';
const fileName = 'libmulti_party_eddsa.so';
const localFilePath = path.join(os.tmpdir(), fileName);

async function downloadFile() {
  try {
    console.log(`InsideDownload::::: ${bucketName} ::::: ${fileName} :::: ${localFilePath}`)
  await storage
      .bucket(bucketName)
      .file(fileName)
      .download({destination: localFilePath})
  console.log('File downloaded to:', localFilePath);
  return localFilePath;
  } catch (error) {
    console.error('Error downloading file:', error);
  }
}


exports.keygen = async (req, res) => {
  let localFilePath = await downloadFile();
  console.log('File downloaded to:', localFilePath);
  let mpc = ffi.Library(localFilePath, {
        generate: ['string', ['string', 'string', 'string', 'string']],
        sign: [
          'string',
          ['string', 'string', 'string', 'string', 'string', 'string'],
        ],
      })
  console.log("Body::", req.body);
  console.log(`MPC::::: ${mpc} :::: `);
  const {roomId, address, parties, threshold} = req.body;
  console.log(`roomId:::${roomId} :::: ${address} :::: ${parties} ::::: ${threshold}`)
  const jsonResponse = mpc.generate(roomId, address, parties, threshold);
  res.status(200).send(jsonResponse);
}