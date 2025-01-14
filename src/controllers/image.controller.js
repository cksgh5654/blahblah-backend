const { PutObjectCommand } = require("@aws-sdk/client-s3");
const config = require("../../consts");
const s3 = require("../utils/s3.util");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const imageController = require("express").Router();

imageController.get("/presigned-url", async (req, res) => {
  const { fileName, fileType } = req.query;
  if (!fileName || !fileType) {
    return res
      .status(400)
      .json({ isError: false, message: "파일이름과 타입이 필요합니다." });
  }
  const params = {
    Bucket: config.aws.s3.bucketName,
    Key: `images/${fileName}`,
    ContentType: fileType,
  };
  try {
    const command = new PutObjectCommand(params);
    const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 60 });
    return res.status(200).json({ isError: false, presignedUrl });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      isError: false,
      message: "Presigned Url 요청에 실패하였습니다.",
    });
  }
});

module.exports = imageController;
