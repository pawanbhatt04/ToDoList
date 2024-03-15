import express from "express";
import mongoose from "mongoose";
mongoose.connect("mongodb://127.0.0.1:27017/ToDoListDB", {useNewUrlParser: true});

const taskschema = new mongoose.Schema({
    task: String
});

const Task = mongoose.model("task", taskschema);


const customListSchema = new mongoose.Schema({
    name: String,
    items: [taskschema],
});

const List = mongoose.model("customList", customListSchema);

const app = express();
const port = 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

var label=[];
var htmll;
var i=1;
var task=[];

app.post("/submit", (req, res)=>{
    var listName = req.body["submit"];
    task.push(req.body["task"]);
    var item = new Task({
        task: req.body["task"],
    });
    if(listName === "Today"){
    item.save(); 
    res.redirect("/");
    }
    else{
    List.findOneAndUpdate({name: listName}, {$push: {items: item}}).then(user=>{
        console.log(user);
    }).catch(err=>{
        console.error(err);
    });
    // htmll = '<input type="checkbox" id="task'+ i +'" name="task'+ i +'" value="task'+i+'">'+'<div class="taskitem"class="" for="task'+ i +'" id="task'+ i++ +'">'+ req.body["task"] +'</div>';
    // console.log(htmll);
    // label.push(htmll);
    
    res.redirect("/" + listName);
}

});
function getUsers() {
    // Use the Promise returned by the find() method
    return Task.find({})
      .then(task => {
        return task; // Return the array of user documents
      })
      .catch(error => {
        throw error; // Throw the error to be caught by the caller
      });
  }
app.post("/delete",(req,res)=>{
    // var a = Number(req.body["num"]);
    // var firsthalf = task.slice(0, a);
    // var secondhalf = task.slice(a+1);
    // task = firsthalf.concat(secondhalf);
    // console.log(firsthalf,secondhalf);
    // console.log(task);
    // res.redirect("/");
    var listName = req.body["submit"];
    var id = String(req.body["num"]);
    if(listName==="Today"){
    Task.findByIdAndDelete(id)
  .then(deletedTask => {
    console.log(deletedTask); // The deleted user document
  })
  .catch(error => {
    console.error(error);
  });
  res.redirect("/");
    }
else{
console.log(id, listName);


List.findOneAndUpdate({name: listName}, { $pull: { items:{_id: id }} }, { new: true })
  .then(updatedUser => {
    if (updatedUser) {
      console.log('Updated User:', updatedUser);
    } else {
      console.log('User not found.');
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
  res.redirect("/"+listName);
}
  });

var item = [];

app.get("/:customListName", (req, res)=>{
    const listName = req.params.customListName;
    List.findOne({name: listName }).then((user)=>{
        if(user){
            console.log("list exists");
            res.render("index.ejs",{
                labelname: label,
                items: user.items,
                name: user.name,
            });
        }
        else{
            
            const list = new List({
            name: listName,
            items: [],
            });
            list.save();
            res.redirect("/" + listName);
        }
    }).catch((err)=>{
        // const list = new List({
        //     name: listName,
        //     items: [],
        // });
        console.log("doesn't exist");
    });
});
app.get("/", (req, res)=>{
    getUsers().then(task=>{
        item = task;
    }).catch(err=>{
        console.error(err);
    }).finally(()=>{
        res.render("index.ejs",{
            labelname: label,
            items: item,
            name: "Today",
        });
    });
    
});
app.listen(port, ()=>{
    console.log("listening on port 3000");
});