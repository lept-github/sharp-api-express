const sharp = require('sharp');
const multer = require('multer');
const express = require('express');

// express
const app = express();
const port = 3000;

// Configure multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const FILE_TYPES = {
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "gif": "image/gif",
    "svg": "image/svg+xml",
    "bmp": "image/bmp",
    "ico": "image/vnd.microsoft.icon",
}

app.post('/v1/sharp/:operation', upload.single('image'), async (req, res) => {
    try{
        // make sure we have a file object in the request
        const file = req?.file;
        if( !file ){
            return res.status(500).json({ error: 'no image detected.' });
        }

        // then, make sure the file object has the originalname prop
        const originalname = file?.originalname;
        if( !originalname ){
            return res.status(500).json({ error: 'image missing originalname.' });
        }

        // originalname should have a file extension
        const originalNameArr = originalname.split('.');
        if( originalNameArr.length <= 1 ){
            return res.status(500).json({ error: 'wrong image originalname.' });
        }

        // the file extension should be in the list of supported ones
        const ext = originalNameArr[originalNameArr.length-1];
        if( !Object.keys(FILE_TYPES).includes(ext.toLowerCase()) ){
            return res.status(500).json({ error: `unsupported file type, only allowed: ${Object.keys(FILE_TYPES).join(', ')}.` });
        }

        // then, make sure the file object has the mimetype prop
        const mimetype = file?.mimetype;
        if( !mimetype ){
            return res.status(500).json({ error: 'image missing mimetype.' });
        }

        // the mimetype should match the file extension
        if( FILE_TYPES[ext] !== mimetype.toLowerCase() ){
            return res.status(500).json({ error: 'wrong image mimetype.' });
        }

        // then, make sure the file object has the size prop
        const size = file?.size;
        if( !size ){
            return res.status(500).json({ error: 'image missing size.' });
        }

        // accept images only under 5mb
        if( size >= 5000000 ){
            return res.status(500).json({ error: 'max image size is 5mb.' });
        }

        // make sure the operation param is in the request
        const operation = req?.params?.operation;
        if( !operation ){
            return res.status(500).json({ error: 'missing operation.' });
        }

        // load image from buffer
        const oldImage = sharp(file.buffer);

        // then, make sure the "sharp" api has the requested operation
        if( !oldImage[operation] ){
            return res.status(500).json({ error: 'unsupported operation.' });
        }

        // get the options form the request
        let options = req?.body?.options?.toString() || null;
        if( options ){
            try{
                options = JSON.parse(options);
            }
            catch( error ){
                return res.status(500).json({ error: 'wrong options format.' });
            }
        }

        // manipulate image
        const newImage = await oldImage[operation](options);
        const newImageBuffer = await newImage.toBuffer();

        // set the appropriate headers
        res.set('Content-Type', 'image/jpeg');
        res.set('Content-Disposition', 'inline');

        // send the manipulated image back to the UI
        res.send(newImageBuffer);
    }
    catch( error ){
        return res.status(500).json({ error: 'there has been an unknown error.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`API server listening on port ${port}`);
});