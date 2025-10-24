// import React, { useState } from "react";
// import JoditEditor from "jodit-react";

// export default function MyEditor() {
//   const [value, setValue] = useState("");

//   return (
//     <div>
//       <JoditEditor value={value} onChange={newValue => setValue(newValue)} />
//       <button onClick={() => console.log(value)}>Save</button>
//     </div>
//   );
// }

// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import React, { useState } from "react";

// export default function MyEditor() {
//   const [data, setData] = useState("");

//   return (
//     <div>
//       <CKEditor editor={ClassicEditor} data={data} onChange={(event, editor) => {
//         const value = editor.getData();
//         setData(value);
//       }}/>
//       <button onClick={() => console.log(data)}>Save</button>
//     </div>
//   );
// }


// import React, { useRef } from 'react';
// import { Editor } from '@tinymce/tinymce-react';

// export default function SimpleEditor() {
//   const editorRef = useRef(null);

//   const handleSave = () => {
//     if (editorRef.current) {
//       // Get the content of editor as HTML
//       const content = editorRef.current.getContent();
//       console.log("Saved Content:", content);
//     }
//   };

//   return (
//     <div>
//       <h3>Enter Description:</h3>
//       <Editor
//         onInit={(evt, editor) => (editorRef.current = editor)}
//         initialValue="<p>Hello, start typing here...</p>"
//         init={{
//           height: 300,
//           menubar: false,
//           plugins: [
//             'advlist autolink lists link image charmap print preview anchor',
//             'searchreplace visualblocks code fullscreen',
//             'insertdatetime media table paste help wordcount'
//           ],
//           toolbar:
//             'undo redo | formatselect | bold italic backcolor | \
//              alignleft aligncenter alignright alignjustify | \
//              bullist numlist outdent indent | removeformat | help'
//         }}
//       />
//       <button onClick={handleSave} style={{ marginTop: '10px' }}>
//         Save
//       </button>
//     </div>
//   );
// }
