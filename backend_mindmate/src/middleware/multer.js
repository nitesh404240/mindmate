import multer from "multer";
import path from "path";

const storage = multer.diskStorage({

destination: function (req, file, cb) {
cb(null, "public/temp");   // changed here
},

filename: function (req, file, cb) {
const uniqueName =
Date.now() + "-" + Math.round(Math.random() * 1e9);

cb(null, uniqueName + path.extname(file.originalname));
}

});

const fileFilter = (req, file, cb) => {

if (file.mimetype.startsWith("audio/")) {
cb(null, true);
} else {
cb(new Error("Only audio files allowed"), false);
}

};

export const upload = multer({
storage,
fileFilter
});