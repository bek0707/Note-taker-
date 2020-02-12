var noteContents = require("../db/db.json")

//Create promise-based versions of functions using node style callbacks
var fs = require("fs");
var util = require("util");
var writeFileAsync = util.promisify(fs.writeFile);

// Create a route
module.exports = function(app) {

    //Display all notes
    app.get("/api/notes", function(req, res) {
        res.json(noteContents);
       // console.log("Inside get notes");
    });

    //Create new posts
    app.post("/api/notes", function(req, res) {
        // noteContents.push(req.body);
        // res.json(noteContents);

        var newNote = req.body;

        // check to find last id in our notes json file, and assign the note to one greater than that id
        var lastId = noteContents[noteContents.length - 1]["id"];
        var newId = lastId + 1;
        newNote["id"] = newId;
        
        console.log("Req.body:", req.body);
        noteContents.push(newNote);

        // write to the noteContents.json file as well
        writeFileAsync("./db/noteContents.json", JSON.stringify(noteContents)).then(function() {
            console.log("noteContents.json has been updated!");
        });

        res.json(newNote);
    });

    // Delete a post
    app.delete("/api/notes/:id", function(req, res) {
        // let chosen = req.params.id;        
        // console.log(chosen);

        console.log("Req.params:", req.params);
        var chosenId = parseInt(req.params.id);
        console.log(chosenId);


        for (var i = 0; i < noteContents.length; i++) {
            if (chosenId === noteContents[i].id) {
                // delete noteContents[i];
                noteContents.splice(i,1);
                
                var noteJSON = JSON.stringify(noteContents, null, 2);

                writeFileAsync("./db/noteContents.json", noteJSON).then(function() {
                console.log ("Chosen note has been deleted!");
            });                 
            }
        }
        res.json(noteContents);
        // data = data.filter(function(res) {
        //     return noteContent.item.replace(/ /g, '-') !== req.params.id;
    });
        
};


