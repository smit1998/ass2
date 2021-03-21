import API from './api.js';
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from './helpers.js';
// things to be done - Create a new alert box for all the pages

// feeds page starts here
// complete this function after completing follows

// helper function for showing all the posts
function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

function postLoop(feedsPosts, authToken) {
    for(let i = 0; i < feedsPosts.length; i++) {
        const newPostDiv = document.createElement("div");
        const newP1 = document.createElement("p");
        const newP2 = document.createElement("p");
        const newIMG = document.createElement("img");
        const newP4 = document.createElement("p");
        const newP5 = document.createElement("p");
        const newP6 = document.createElement("p");
        let likeButton = document.createElement("button");
        let commentButton = document.createElement("button");
        let likedByButton = document.createElement("button");
        let commentedByButton = document.createElement("button");

        // content of the post to be shown
        newP1.innerText = feedsPosts[i].meta.author;
        newP2.innerText = "Posted At: " + feedsPosts[i].meta.published;

        let postImg = document.createTextNode(feedsPosts[i].thumbnail);
        newP4.innerText = "Liked by: 👍 " + feedsPosts[i].meta.likes;
        newP4.id = "postLike" + feedsPosts[i].id;
        newP4.style.display = "none";
        newP5.innerText = "Status: " + feedsPosts[i].meta.description_text; 
        
        // commented by text

        if(feedsPosts[i].comments.length != 0){
            newP6.innerText = "Comments from your friends:- " + feedsPosts[i].comments[0].author + ": " + feedsPosts[i].comments[0].comment;
            for(let j = 1; j < feedsPosts[i].comments.length; j++) {
                newP6.innerText = newP6.innerText + ", " + feedsPosts[i].comments[j].author + ": " + feedsPosts[i].comments[j].comment;
        }   }
        else{
            newP6.innerText = "No comments yet!";
        }
        newP6.style.display = "none";
        // adding all the required paramaeters to like button
         
        // like button (FETCH NOT WORKING YET)
        likeButton.type = "button";
        likeButton.innerText = "💗 Like";
        likeButton.id = "postLikeButton" + feedsPosts[i].id;
        likeButton.classList.add("likeButton");
        likeButton.onclick = () => {
            const likedByUser = fetch('http://localhost:5000/post/like', {
                method: 'PUT',
                headers: {
                    'Authorization': 'Token ' + authToken,
                    'Id': feedsPosts[i].id
                },
            }).then((data) => {
                if(data.status == 200) {
                    alert("Post recently liked by you!");
                }
                else if(data.status == 400) {
                    alert("Malformed Request");
                }
                else if(data.status == 403) {
                    alert("Invalid Auth Token");
                }
                else if(data.status == 404) {
                    alert("Post Not Found");
                }
            }).catch((error) => {
                alert(error);
            }) ;
        };

        // comment button
        commentButton.type = "button";
        commentButton.innerText = "💬 𝘤𝘰𝘮𝘮𝘦𝘯𝘵";
        commentButton.id = "postCommentButton" + feedsPosts[i].id;
        commentButton.classList.add("postCommentButton");
        console.log(feedsPosts[i].id);
        commentButton.onclick = () => {
            const commentWords = {
                "comment": "hey, how r u?"
            };
            const commentedByUser = fetch('http://localhost:5000/post/comment', {
                method: 'PUT',
                headers: {
                    'Authorization': 'Token ' + authToken,
                    'id': feedsPosts[i].id
                },
                body: commentWords
            }).then((data) => {
                if(data.status == 200) {
                    alert("comment has been added");
                }
                else{
                    alert(data.status);
                }
            }).catch((error) => {
                alert("Error: " + error);
            });
        };


        // liked by button
        likedByButton.type = "button";
        likedByButton.innerText = "Liked By"
        likedByButton.id = "postLikedByButton" + feedsPosts[i];
        likedByButton.classList.add("postLikedByButton");
        likedByButton.onclick = () => {
            newP4.style.display = "block";
        }

        // commented by Button
        commentedByButton.type = "button";
        commentedByButton.innerText = "Commented by";
        commentedByButton.id = "commentedByButton" + feedsPosts[i];
        commentedByButton.classList.add("commentedByButton");
        commentedByButton.onclick = () => {
            newP6.style.display = "block";
        }

        // adding everything to the div
        newPostDiv.appendChild(newP1);
        newPostDiv.appendChild(newP2);
        newIMG.src = "data:image/png;base64," + postImg;
        newPostDiv.appendChild(newIMG);
        newPostDiv.appendChild(newP4);
        newPostDiv.appendChild(newP5);
        newPostDiv.appendChild(newP6);
        newPostDiv.appendChild(likeButton);
        newPostDiv.appendChild(commentButton);
        newPostDiv.appendChild(likedByButton);
        newPostDiv.appendChild(commentedByButton);
        newPostDiv.classList.add("eachPost");

        const feedsDiv = document.getElementById('Feed');
        feedsDiv.appendChild(newPostDiv);

        insertAfter(newPostDiv, feedsDiv);
    }
}

// feeds function
function userFeeds(authToken) {
    console.log(authToken);
    const feedsResult = fetch('http://localhost:5000/user/feed', {
        method: 'GET',
        headers: {
            'Authorization': 'Token ' + authToken,
            'p': 0,
            'n': 10
        }
    }).then((data) => {
        if(data.status == 200) {
            data.json().then((feedsResult) => {
                let feedsPosts = feedsResult.posts;

                if(feedsPosts.length >= 1) {
                    let feeds = document.getElementById('userFeeds');
                    feeds.style.display = "none";

                    let showFeeds = document.getElementById('userFeedsShow');
                    showFeeds.style.display = "block";
                }
                postLoop(feedsPosts, authToken);

            })
        }
        else if(data.status == 403) {
            alert("Error 403");
        }
    }).catch((error) =>  {
        alert("Error!");
    });

};

// login function
document.getElementById('loginButton').addEventListener('click', () => {
    const userLogin = {
        "username" : document.getElementById('loginUserName').value,
        "password" : document.getElementById('loginPassword').value
    };

    let confirmPassword = document.getElementById('confirmPassword').value;
    if(userLogin.password != confirmPassword) {
        alert("Password doesn't match");
    }
    else {
        const loginResult = fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userLogin),
        }).then((data) => {
            if(data.status == 200) {
                data.json().then((loginResult) => {
                    userFeeds(loginResult.token);
                })
                //if data is success display feeds page
                let loginPage = document.getElementById('loginPage');
                loginPage.style.display = "none";

                let feeds = document.getElementById('userFeeds');
                feeds.style.display = "block";

            } else if(data.status == 403) {
                alert("Incorrect Login details!");
            }

        }).catch((error) => {
            alert("Error");
        });
    }
});


// register function
document.getElementById('loginRegisterButton').addEventListener('click', () => {
    let loginPage = document.getElementById('loginPage');
    loginPage.style.display = "none";
    
    let registerPage = document.getElementById('registerPage');
    registerPage.style.display = "block";

    document.getElementById('registerButton').addEventListener('click', () => {
        const registerDetails = {
            "username" : document.getElementById('registerUserName').value,
            "password" : document.getElementById('registerPassword').value,
            "email" : document.getElementById('registerEmail').value,
            "name" : document.getElementById('registerName').value
        };
    
        let registerConfirmPass = document.getElementById('registerConfirmPassword').value;
        if(registerConfirmPass != registerDetails.password) {
            alert("Passwords do not match!");
        }
        else {
            const registerResult = fetch('http://localhost:5000/auth/signup', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(registerDetails)
            
            }).then ((data) =>  {
                if(data.status == 200) {
                    // take to user to feeds
                    data.json().then((registerResult) => {
                        userFeeds(registerResult.token);
                    })
                    registerPage.style.display = "none";
    
                    let feeds = document.getElementById('userFeeds');
                    feeds.style.display = "block";
                }
                else if(data.status == 403) {
                    alert("error code: 403");
                }
                else if(data.status == 400) {
                    alert("error code: 400");
                }
            }).catch ((error) => {
                console.log("Error: " + error);
                alert("Error!!");
            });
        }
    });
});


