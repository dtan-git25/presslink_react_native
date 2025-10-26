import DocumentPicker from 'react-native-document-picker';
// Pick multiple files
const pickMultipleFile = async cb => {
  try {
    const results = await DocumentPicker.pickMultiple({
      type: [
        DocumentPicker.types.images,
        DocumentPicker.types.csv,
        DocumentPicker.types.doc,
        DocumentPicker.types.docx,
        DocumentPicker.types.pdf,
        DocumentPicker.types.plainText,
        DocumentPicker.types.ppt,
        DocumentPicker.types.pptx,
        DocumentPicker.types.xls,
        DocumentPicker.types.xlsx,
      ],
    });
    for (const res of results) {
      let file = {
        uri: res.uri,
        type: res.type,
        name: res.name,
        size: res.size,
      };
      cb(file);
    }
  } catch (err) {
    if (DocumentPicker.isCancel(err)) {
      // User cancelled the picker, exit any dialogs or menus and move on
    } else {
      throw err;
    }
  }
};

// Pick a single file
const pickSingleFile = async cb => {
  try {
    const res = await DocumentPicker.pick({
      type: [
        DocumentPicker.types.images,
        DocumentPicker.types.csv,
        DocumentPicker.types.doc,
        DocumentPicker.types.docx,
        DocumentPicker.types.pdf,
        DocumentPicker.types.plainText,
        DocumentPicker.types.ppt,
        DocumentPicker.types.pptx,
        DocumentPicker.types.xls,
        DocumentPicker.types.xlsx,
      ],
    });
    let file = {
      uri: res.uri,
      type: res.type,
      name: res.name,
      size: res.size,
    };
    cb(file);
  } catch (err) {
    if (DocumentPicker.isCancel(err)) {
      // User cancelled the picker, exit any dialogs or menus and move on
    } else {
      throw err;
    }
  }
};

const removeFile = (prevState, index, cb) => {
  let prevData = prevState;
  prevData.splice(index, 1);
  cb(prevData);
};

export {pickSingleFile, pickMultipleFile, removeFile};
