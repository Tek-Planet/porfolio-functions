const {admin,db} = require('../util/admin')
const config = require("../util/config");


exports.projects = (req, res) => {
let location = ""
  db.collection('projects')
    .orderBy('createdAt', 'desc')
    .get()
    .then((data) => {
      let projects = [];
      data.forEach((doc) => {
        projects.push({
          projectId: doc.id,
          body: doc.data().body,
          title: doc.data().title,
          tools:  doc.data().tools,
          img:  doc.data().img,
          imgOne: doc.data().imgOne,
          imgTwo: doc.data().imgTwo,
          imgThree: doc.data().imgThree,
          imgFour: doc.data().imgFour,
          videoId:doc.data().videoId,
          createdAt: doc.data().createdAt,
        });
      });
      return res.json(projects);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.project = (req, res) => {
//body, title, tools, img, imgOne, imgTwo, imgThree, imgFour, videoId
    const newProject = {
      title: req.body.title,
      body: req.body.body,
      tools: req.body.tools,
      img: req.body.img,
      imgOne: req.body.imgOne,
      imgTwo: req.body.imgTwo,
      imgThree: req.body.imgThree,
      imgFour: req.body.imgFour,
      videoId: req.body.videoId,
      createdAt: new Date().toISOString(),

    };

  db.collection('projects')
    .add(newProject)
    .then((doc) => {
      const resProject = newProject;
      resProject.ProjectId = doc.id;
      res.json(resProject);
    })
    .catch((err) => {
      res.status(500).json({ error: 'something went wrong' });
      console.error(err);
    });
};


exports.projectImage = (req, res) => {
  
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");

  const busboy = new BusBoy({ headers: req.headers });

  let imageToBeUploaded = {};
  let imageFileName;
  // String for image token
  let generatedToken = new Date().toISOString();

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    console.log(fieldname, file, filename, encoding, mimetype);
    if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
      return res.status(400).json({ error: "Wrong file type submitted" });
    }
    // my.image.png => ['my', 'image', 'png']
    const imageExtension = filename.split(".")[filename.split(".").length - 1];
    // 32756238461724837.png
    imageFileName = `${Math.round(
      Math.random() * 1000000000000
    ).toString()}.${imageExtension}`;
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));
  });
  busboy.on("finish", () => {
    admin
      .storage()
      .bucket()
      .upload(imageToBeUploaded.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype,
            //Generate token to be appended to imageUrl
            firebaseStorageDownloadTokens: generatedToken,
          },
        },
      })
      .then(() => {
        // Append token to url
       
       const location  = req.params.location
       const projectId = req.params.projectId
      if(location === 'img'){
       const img = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media&token=${generatedToken}`;  
       return db.doc(`/projects/${projectId}`).update({img});}

       else if(location === 'imgOne'){
        const imgOne = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media&token=${generatedToken}`;  
        return db.doc(`/projects/${projectId}`).update({imgOne});}

      else if(location === 'imgTwo'){
      const imgTwo = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media&token=${generatedToken}`;  
      return db.doc(`/projects/${projectId}`).update({imgTwo});}

      else if(location === 'imgThree'){
        const imgThree = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media&token=${generatedToken}`;  
        return db.doc(`/projects/${projectId}`).update({imgThree});}

      else {
          const imgFour = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media&token=${generatedToken}`;  
          return db.doc(`/projects/${projectId}`).update({imgFour});}
      })
      .then(() => {
        return res.json({ message: "image uploaded successfully" });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: "something went wrong" });
      });
  });
  busboy.end(req.rawBody);
};


