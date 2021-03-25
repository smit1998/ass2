import API from './api.js';
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from './helpers.js';
// things to be done - Create a new alert box for all the pages


// helper function for liked By button to get the names of people who liked it.
function getUsernames(authenticationToken, likedByIds) {
    let namesList = [];
    for(let i = 0; i < likedByIds.length; i++) {
        const getusername = fetch('http://localhost:5000/user/?id=' + likedByIds[i], {
        method: 'GET',
        headers: {
            'Authorization': 'Token ' + authenticationToken,
            'Content-Type': 'application/json'
        }
        }).then((data) => {
            data.json().then((getusername) => {
                namesList.push(getusername.username);
            });
        }).catch((error) => {
            alert(error);
        });
    }
    //////////////////////////////////////remove this line /////////
    console.log(namesList);
    return namesList;
}

function getUserId(authenticationToken, followButton, authorName) {
    const getId = fetch('http://localhost:5000/user/?username=' + authorName, {
        method: 'GET',
        headers: {
            'Authorization': 'Token ' + authenticationToken,
            'Content-Type': 'application/json'
        }
    }).then((data) => {
        data.json().then((getId) => {
            userFollow(authenticationToken, getId.username, followButton);
        });
    }).catch((error) => {
        alert(error);
    });
};

// Follow/ Unfollow operation
function userFollow(authenticationToken, userToFollow, followButton) {
    if(followButton.innerText == "✔️") {
        followButton.innerText = "➕";
        fetch('http://localhost:5000/user/follow?username=' + userToFollow, {
            method: 'PUT',
            headers: {
                'Authorization': 'Token ' + authenticationToken,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify()
        }).then((data) => {
            if(data.status == 200) {
                alert("Unfollowed");
            }
        }).catch((error) => {
            alert(error);
        });
    }
    else{
        followButton.innerText = "✔️";
        fetch('http://localhost:5000/user/unfollow?username=' + userToFollow, {
            method: 'PUT',
            headers: {
                'Authorization': 'Token ' + authenticationToken,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify()
        }).then((data) => {
            if(data.status == 200) {
                alert("Followed");
            }
        }).catch((error) => {
            alert(error);
        });
    }
};

// Like post
function likePostFunction(likeButton, id, authenticationToken) {
    if(likeButton.innerText == "💗 Like"){
        likeButton.innerText = "Unlike";
        fetch('http://localhost:5000/post/like?id='+ id, {
                method: 'PUT',
                headers: {
                    'Authorization': 'Token ' + authenticationToken,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify()
            }).then((data) => {
                if(data.status == 200) {
                    console.log("Post liked by You :)");
                }    
            }).catch((error) => {
                alert(error);
            });
    }
    else {
        likeButton.innerText = "💗 Like";
        fetch('http://localhost:5000/post/unlike?id='+ id, {
            method: 'PUT',
            headers: {
                'Authorization': 'Token ' + authToken,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify()
        }).then((data) => {
            if(data.starts == 200) {
                console.log("Post unliked");
            }
        }).catch((err) => {
            alert(err);
        });
    }
}

// User profile for Author of the account///////////////////////////////////////////////////////////////////////////////////////////////////////////
function userProfile(authenticationToken) {
    const userProfilePage = document.getElementById('userProfile');
    userProfilePage.style.display = "block";
    const userDiv = document.createElement('div');
    // fetch request to get all the user details
    const userDetails = fetch('http://localhost:5000/user/', {
        method: 'GET',
        headers: {
            'Authorization': 'Token ' + authenticationToken,
        }
    }).then((data) => {
        if(data.status == 200) {
            data.json().then((userPorfileResult) => {
                //console.log("User Profile: " + userPorfileResult.username);
                userDiv.classList.add("userProfile");
                // Display username
                const userProfileUserName = document.createElement('p');
                userProfileUserName.innerText = "👬" + userPorfileResult.username;
                userDiv.appendChild(userProfileUserName);

                // Display name
                const userProfileName = document.createElement('p');
                userProfileName.innerText = userPorfileResult.name;
                userDiv.appendChild(userProfileName);

                // Display email address
                const userProfileEmail = document.createElement('p');
                userProfileEmail.innerText = userPorfileResult.email;
                userDiv.appendChild(userProfileEmail);

                // Display who the user is following (Display name of followers)
                const userProfileFollowing = document.createElement('p');
                userProfileFollowing.innerText = "Following:- " + userPorfileResult.following;
                userDiv.appendChild(userProfileFollowing);

                // Display number of followers
                const userProfileFollower = document.createElement('p');
                userProfileFollower.innerText = "Followers: " + userPorfileResult.followed_num;
                userDiv.appendChild(userProfileFollower);

                // appending the userpage div to parent div in DOM
                userProfilePage.appendChild(userDiv);
            });
        }
    }).catch((error) => {
        alert(error);
    });
};

// User profile page for other users
function userPorfile(authenticationToken, userNameOfPerson, userIdOfPerson) {
    const userProfilePage = document.getElementById('userProfile');
    userProfilePage.style.display = "block";
    const userDiv = document.createElement('div');
    console.log(userNameOfPerson);
    // fetch request to get all the user details
    const userDetails = fetch('http://localhost:5000/user/?username=' + userNameOfPerson, {
        method: 'GET',
        headers: {
            'Authorization': 'Token ' + authenticationToken,
        }
    }).then((data) => {
        if(data.status == 200) {
            data.json().then((userPorfileResult) => {
                //console.log("User Profile: " + userPorfileResult.username);
                userDiv.classList.add("userProfile");
                // Display username
                const userProfileUserName = document.createElement('p');
                userProfileUserName.innerText = "👬" + userPorfileResult.username;
                userDiv.appendChild(userProfileUserName);

                // Display name
                const userProfileName = document.createElement('p');
                userProfileName.innerText = userPorfileResult.name;
                userDiv.appendChild(userProfileName);

                // Display email address
                const userProfileEmail = document.createElement('p');
                userProfileEmail.innerText = userPorfileResult.email;
                userDiv.appendChild(userProfileEmail);

                // Display who the user is following (Display name of followers)
                const userProfileFollowing = document.createElement('p');
                userProfileFollowing.innerText = "Following:- " + userPorfileResult.following;
                userDiv.appendChild(userProfileFollowing);

                // Display number of followers
                const userProfileFollower = document.createElement('p');
                userProfileFollower.innerText = "Followers: " + userPorfileResult.followed_num;
                userDiv.appendChild(userProfileFollower);

                // appending the userpage div to parent div in DOM
                userProfilePage.appendChild(userDiv);
            });
        }
    }).catch((error) => {
        alert(error);
    });
};

// feeds page starts here
// complete this function after completing follows

// helper function for showing all the posts
function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

function postLoop(feedsPosts, authToken, showFeeds) {
    console.log(feedsPosts);
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
        let commentBox = document.createElement("input");

        commentBox.style.display = "none";
        commentBox.classList.add("commentBox");
        commentBox.id = "commentBox";

        let followButton = document.createElement('button');
        followButton.innerText = "✔️";
        followButton.classList.add("followButton");
        followButton.onclick = () => {
            console.log("Username of post: " + feedsPosts[i].meta.author);
            getUserId(authToken, followButton, feedsPosts[i].meta.author);
        };

        // content of the post to be shown
        newP1.innerText = "👬" + feedsPosts[i].meta.author;
        newP1.id = feedsPosts[i].meta.author + "id";
        newP1.style.color = "white";
        newP1.onclick = () => {
            // disable feeds and show user the profile of the person
            showFeeds.style.display = "none";
            userPorfile(authToken, feedsPosts[i].meta.author, feedsPosts[i].id);
        }

        newP2.innerText = "Posted At: " + feedsPosts[i].meta.published;
        
        newP4.id = "postLike" + feedsPosts[i].id;
        newP4.style.display = "none";
        
        newP5.innerText = "Status: " + feedsPosts[i].meta.description_text; 

        // commented by text
        if(feedsPosts[i].comments.length != 0){
            newP6.innerText = feedsPosts[i].comments[0].author + ": " + feedsPosts[i].comments[0].comment;
            for(let j = 1; j < feedsPosts[i].comments.length; j++) {
                newP6.innerText = newP6.innerText + ", " + feedsPosts[i].comments[j].author + ": " + feedsPosts[i].comments[j].comment;
        }   }
        else{
            newP6.innerText = "No comments yet!";
        }
        newP6.style.display = "none";

        // like/ Unlike button
        likeButton.type = "button";
        likeButton.innerText = "💗 Like";
        likeButton.id = "postLikeButton" + feedsPosts[i].id;
        likeButton.classList.add("postButton");
        likeButton.onclick = () => {
            likePostFunction(likeButton, feedsPosts[i].id, authToken);
        };

        // comment button (Works)
        commentButton.type = "button";
        commentButton.innerText = "💬 𝘤𝘰𝘮𝘮𝘦𝘯𝘵";
        commentButton.id = "postCommentButton" + feedsPosts[i].id;
        commentButton.classList.add("postButton");
        commentButton.onclick = () => {
            commentBox.style.display = "block";
            commentBox.onblur = () => {
                    const commentWords = {
                    "comment": document.getElementById('commentBox').value,
                };
                const commentedByUser = fetch('http://localhost:5000/post/comment?id=' + feedsPosts[i].id, {
                    method: 'PUT',
                    headers: {
                        'Authorization': 'Token ' + authToken,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(commentWords)
                }).then((data) => {
                    if(data.status == 200) {
                        alert("comment has been added");
                    }
                    else{
                        alert("Please enter comment and than click outside the box!");
                    }
                }).catch((error) => {
                    alert("Error: " + error);
                });
                const commentBoxReset = document.getElementById('commentBox');
                commentBoxReset.value = '';
            };
        };


        // liked by button
        likedByButton.type = "button";
        likedByButton.innerText = "Liked By"
        likedByButton.id = "postLikedByButton" + feedsPosts[i];
        likedByButton.classList.add("postButton");
        likedByButton.onclick = () => {
            
            let likedByListNames = getUsernames(authToken, feedsPosts[i].meta.likes);
            console.log("Names:" + likedByListNames);
/////////////////////////// THIS LIKE NOT WORKING/////////////////////////////////////////////////////////////////////////////////////////////////////////////
            newP4.innerText = "Liked by: 👍 " + likedByListNames;

            if(newP4.style.display == "none") {
                newP4.style.display = "block";
            }
            else {
                newP4.style.display = "none";
            }
        };

        // commented by Button
        commentedByButton.type = "button";
        commentedByButton.innerText = "Commented by";
        commentedByButton.id = "commentedByButton" + feedsPosts[i];
        commentedByButton.classList.add("postButton");
        commentedByButton.onclick = () => {
            if(newP6.style.display == "none") {
                newP6.style.display = "block";
            }else {
                newP6.style.display = "none";
            }
        };

        // providing the source to the image
        let postImg = feedsPosts[i].src;
        // adding everything to the div
        newPostDiv.appendChild(followButton);
        newPostDiv.appendChild(newP1);
        newPostDiv.appendChild(newP2);
        newIMG.src = "data:image/jpeg;base64," + postImg;
        newPostDiv.appendChild(newIMG);
        newPostDiv.appendChild(newP5);
        newPostDiv.appendChild(newP4);
        newPostDiv.appendChild(newP6);
        newPostDiv.appendChild(likeButton);
        newPostDiv.appendChild(commentButton);
        newPostDiv.appendChild(likedByButton);
        newPostDiv.appendChild(commentedByButton);
        newPostDiv.appendChild(commentBox);
        newPostDiv.classList.add("eachPost");

        const feedsDiv = document.getElementById('Feed');
        feedsDiv.appendChild(newPostDiv);

        insertAfter(newPostDiv, feedsDiv);
        // adding each post to a parent div named showFeeds.
        showFeeds.appendChild(newPostDiv);
    }
};

// feeds function
function userFeeds(authToken) {
    console.log(authToken);

    const feedsResult = fetch('http://localhost:5000/user/feed', {
        method: 'GET',
        headers: {
            'Authorization': 'Token ' + authToken,
            'Content-Type': 'application/json',
        }
    }).then((data) => {
        if(data.status == 200) {
            data.json().then((feedsResult) => {
                let feedsPosts = feedsResult.posts;
                feedsPosts.sort((a,b) => {
                    return b.published - a.published;
                });
                /////////////////////////////////////////////////////////////////////////////////////////////////////
                document.getElementById('homeButton').addEventListener('click',() => {
                    const userFeedsShowHome = document.getElementById('userFeedsShow');
                    const userProfileHome = document.getElementById('userProfile');
                    userProfileHome.style.display = 'none';
                    userFeedsShowHome.style.display = 'block';
                });
                if(feedsPosts.length >= 1) {
                    let feeds = document.getElementById('userFeeds');
                    feeds.style.display = "none";

                    let showFeeds = document.getElementById('userFeedsShow');
                    showFeeds.style.display = "block";
                }
                let showFeeds = document.getElementById('userFeedsShow');
                postLoop(feedsPosts, authToken, showFeeds);

            })
        }
    }).catch((error) =>  {
        alert("Error!");
    });

};

function enableUserProfile() {
    const sideBox = document.getElementById('makePost');
    sideBox.style.display = 'block';
}

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
                    window.value = loginResult.token; // setting it to use it in all other functions
                    userFeeds(loginResult.token);
                })
                //if data is success display feeds page
                let loginPage = document.getElementById('loginPage');
                loginPage.style.display = "none";

                let feeds = document.getElementById('userFeeds');
                feeds.style.display = "block";

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
                    enableUserProfile();
                    data.json().then((registerResult) => {
                        userFeeds(registerResult.token);
                    })
                    registerPage.style.display = "none";
    
                    let feeds = document.getElementById('userFeeds');
                    feeds.style.display = "block";
                }
            }).catch ((error) => {
                console.log("Error: " + error);
                alert("Error!!");
            });
        }
    });
});

document.getElementById("addPostButton").addEventListener('click', () => {
    const feedsPage = document.getElementById("userFeedsShow");
    feedsPage.style.display = "none";

    const newPost = document.getElementById('NewPost');
    newPost.style.display = "block";

    document.getElementById('newPostSubmit').addEventListener('click', () => {
        const newPostBody = {
        'description_text': document.getElementById("newPostStatus").value,
        'src': document.getElementById('newPostImageSource').value,
        };

        fetch('http://localhost:5000/post/', {
            method: 'POST',
            headers: {
                'Authorization': 'Token ' + window.value,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newPostBody)
        }).then((data) => {
            if(data.status == 200) {
                newPost.style.display = "none";
                feedsPage.style.display = "block";
                alert("Post Posted");
            }
            else {
                newPost.style.display = "none";
                feedsPage.style.display = "block";
                alert("Post Not uploaded, Try again!");
            }
        }).catch((error) => {
            alert("Error!");
        });
    });

    document.getElementById('newPostCancel').addEventListener('click', () => {
        newPost.style.display = "none";
        feedsPage.style.display = "block";
    });
});