//  async function loadStudents(){
//   const res = await fetch("http://localhost:5000/api/students");
//   const data = await res.json();

//   let html = "<h2>Students List</h2><table>";
//   html += "<tr><th>Name</th><th>Class</th><th>Mobile</th></tr>";

//   data.forEach(s=>{
//     html += `<tr>
//       <td>${s.name}</td>
//       <td>${s.class}</td>
//       <td>${s.mobile}</td>
//     </tr>`;
//   });

//   html += "</table>";
//   document.getElementById("data-area").innerHTML = html;
// }

// async function loadTeachers(){
//   const res = await fetch("http://localhost:5000/api/teachers");
//   const data = await res.json();

//   let html = "<h2>Teachers List</h2><table>";
//   html += "<tr><th>Name</th><th>Subject</th><th>Mobile</th></tr>";

//   data.forEach(t=>{
//     html += `<tr>
//       <td>${t.name}</td>
//       <td>${t.subject}</td>
//       <td>${t.mobile}</td>
//     </tr>`;
//   });

//   html += "</table>";
//   document.getElementById("data-area").innerHTML = html;
// }
// fetch("http://localhost:5000/api/student/all")
//   .then(res => res.json())
//   .then(data => {
//     let html = "";
//     data.forEach(s => {
//       html += `<tr>
//         <td>${s.name}</td>
//         <td>${s.mobile}</td>
//         <td>${s.class}</td>
//       </tr>`;
//     });
//     document.getElementById("studentData").innerHTML = html;
//   });

const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  }
}, { timestamps: true });

// 👇 THIS LINE IS MOST IMPORTANT
module.exports = mongoose.model("Admin", AdminSchema);