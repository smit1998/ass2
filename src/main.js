import API from './api.js';
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from './helpers.js';
// things to be done - Create a new alert box for all the pages

// global varible
var x = 0;
var globalauthToken;
// helper function for liked By button to get the names of people who liked it.
function getUsernames(authenticationToken, likedByIds) {
    let namesMap = new Map();
    for(let i = 0; i < likedByIds.length; i++) {
        const getusername = fetch('http://localhost:5000/user/?id=' + likedByIds[i], {
        method: 'GET',
        headers: {
            'Authorization': 'Token ' + authenticationToken,
            'Content-Type': 'application/json'
        }
        }).then((data) => {
            data.json().then((getusername) => {
                namesMap.set('userName', getusername.username);
            });
        }).catch((error) => {
            alert(error);
        });
    }
    //////////////////////////////////////remove this line /////////
    
    return namesMap;
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

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// function to load user's posts on the profile page given the id's of the posts
function userPostsDisplay(profilePosts, profilePage, authorName, authorPostDiv) {
    for(let i = 0; i < profilePosts.length; i++) {
        const newPostDiv = document.createElement("div");
        const newP1 = document.createElement("p");
        const newP2 = document.createElement("p");
        const newIMG = document.createElement("img");
        newIMG.classList.add('image');
        newIMG.alt = "Image Not Compatible";
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
        commentBox.id = "commentBox" + profilePosts[i];


        // content of the post to be shown
        newP1.innerText = "👬" + authorName;
        newP1.id =authorName + "id";
        newP1.style.color = "white";

        // fetch request to get the entire post
        const entirePost = fetch('http://localhost:5000/post/?id=' + profilePosts[i], {
            method: 'GET',
            headers: {
                'Authorization': 'Token ' + globalauthToken,
                'Content-Type': 'application/json',
            }
        }).then((data) => {
            if(data.status == 200){
                data.json().then((entirePost) => {
                    //console.log(entirePost);
                    newP2.innerText = "Posted At: " + entirePost.meta.published;

                    newP4.id = "postLike" + entirePost.id;
                    newP4.style.display = "none";

                    newP5.innerText = "Status: " + entirePost.meta.description_text;

                    if(entirePost.comments.length != 0){
                        newP6.innerText = entirePost.comments[0].author + ": " + entirePost.comments[0].comment;
                        for(let j = 1; j < entirePost.comments.length; j++) {
                            newP6.innerText = newP6.innerText + ", " + entirePost.comments[j].author + ": " + entirePost.comments[j].comment;
                    }   }
                    else{
                        newP6.innerText = "No comments yet!";
                    }
                    newP6.style.display = "none";

                    // like/ Unlike button
                    likeButton.type = "button";
                    likeButton.innerText = "💗 Like";
                    likeButton.id = "postLikeButton" + entirePost.id;
                    likeButton.classList.add("postButton");
                    likeButton.onclick = () => {
                        likePostFunction(likeButton, entirePost.id, globalauthToken);
                    };

                    // comment button (Works)
                    commentButton.type = "button";
                    commentButton.innerText = "💬 𝘤𝘰𝘮𝘮𝘦𝘯𝘵";
                    commentButton.id = "postCommentButton" + entirePost.id;
                    commentButton.classList.add("postButton");
                    commentButton.onclick = () => {
                        commentBox.style.display = "block";
                        commentBox.onblur = () => {
                                const commentWords = {
                                "comment": document.getElementById('commentBox' + entirePost.id).value,
                            };
                            const commentedByUser = fetch('http://localhost:5000/post/comment?id=' + entirePost.id, {
                                method: 'PUT',
                                headers: {
                                    'Authorization': 'Token ' + globalauthToken,
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(commentWords)
                            }).then((data) => {
                                if(data.status == 200) {
                                    document.getElementById( "postCommentButton" + entirePost.id).value = '';
                                    commentBox.style.display = 'none';
                                    alert("comment has been added");
                                }
                                else{
                                    alert("Please enter comment and than click outside the box!");
                                }
                            }).catch((error) => {
                                alert("Error: " + error);
                            });
                            const commentBoxReset = document.getElementById('commentBox'+entirePost.id);
                            commentBoxReset.value = "";
                        };
                    };

                    // liked by button
                    likedByButton.type = "button";
                    likedByButton.innerText = "Liked By"
                    likedByButton.id = "postLikedByButton" + entirePost[i];
                    likedByButton.classList.add("postButton");
                    likedByButton.onclick = () => {
                        
                        let likedByListNames = getUsernames(globalauthToken, entirePost.meta.likes);
                        //console.log("Names:" + likedByListNames);
            /////////////////////////// THIS LIKE NOT WORKING/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                        const mapEntries = likedByListNames.entries();
                        //console.log(mapEntries.value);

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
                    commentedByButton.innerText = "Commented by: ";
                    commentedByButton.id = "commentedByButton" + entirePost[i];
                    commentedByButton.classList.add("postButton");
                    commentedByButton.onclick = () => {
                        if(newP6.style.display == "none") {
                            newP6.style.display = "block";
                        }else {
                            newP6.style.display = "none";
                        }
                    };

                     // providing the source to the image
                    let postImg = entirePost.src;
                    newIMG.src = "data:image/jpeg;base64," + postImg;
                });
            }
            else{
                alert("Post not got");
            }
        }).catch((Error) => {
            alert(Error);
        });

        // append everything
        // adding everything to the div
        newPostDiv.appendChild(newP1);
        newPostDiv.appendChild(newP2);
        
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
        authorPostDiv.appendChild(newPostDiv);
    }
    profilePage.appendChild(authorPostDiv);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////

// User profile page for other users
function userPorfile(authenticationToken, userNameOfPerson, userIdOfPerson) {
    const authorProfileDiv = document.createElement('div');
    const authorPostDiv = document.createElement('div');
    authorPostDiv.classList.add('userProfilePosts');
    authorProfileDiv.classList.add('userProfilePost');
    const authorProfileName = document.createElement('p');
    const authorProfileEmail = document.createElement('p');
    const authorProfileFollowers = document.createElement('p');
    const authorProfileFollowing = document.createElement('p');
    const profilePage = document.getElementById('userProfile');
    const feedsShowPage = document.getElementById('userFeedsShow');

    
    feedsShowPage.style.display = 'none';
    profilePage.style.display = 'block';

    const authorProfile = fetch('http://localhost:5000/user/?username='+userNameOfPerson, {
        method: 'GET',
        headers: {
            'Authorization': 'Token ' + authenticationToken,
            'Content-Type': 'application/json',
        },
    }).then((data) => {
        if(data.status == 200) {
            data.json().then((authorProfile) => {
                authorProfileName.innerText = authorProfile.name;
                authorProfileEmail.innerText = authorProfile.email;
                authorProfileFollowers.innerText = authorProfile.followed_num;
                //authorProfileFollowing = authorProfile.following.length;
                userPostsDisplay(authorProfile.posts, profilePage, authorProfile.name, authorPostDiv);
            });
        }
    }).catch((Error) => {
        alert(Error);
    });

    authorProfileDiv.appendChild(authorProfileName);
    authorProfileDiv.appendChild(authorProfileEmail);
    authorProfileDiv.appendChild(authorProfileFollowers);
    authorProfileDiv.appendChild(authorProfileFollowing);
    profilePage.appendChild(authorProfileDiv);
};

// feeds page starts here
// complete this function after completing follows

// helper function for showing all the posts
function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

function postLoop(feedsPosts, authToken, showFeeds) {
    for(let i = 0; i < feedsPosts.length; i++) {
        const newPostDiv = document.createElement("div");
        const newP1 = document.createElement("p");
        const newP2 = document.createElement("p");
        const newIMG = document.createElement("img");
        newIMG.alt = "Image Not Compatible";
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
        commentBox.id = "commentBox" + feedsPosts[i].id;

        let followButton = document.createElement('button');
        followButton.innerText = "✔️";
        followButton.classList.add("followButton");
        followButton.onclick = () => {
            //console.log("Username of post: " + feedsPosts[i].meta.author);
            getUserId(authToken, followButton, feedsPosts[i].meta.author);
        };

        // content of the post to be shown
        newP1.innerText = "👬" + feedsPosts[i].meta.author;
        newP1.id = feedsPosts[i].meta.author + "id";
        newP1.style.color = "white";
        newP1.onclick = () => {
            //console.log(feedsPosts[i]);
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
                    "comment": document.getElementById('commentBox' + feedsPosts[i].id).value,
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
                        document.getElementById("postCommentButton" + feedsPosts[i].id).value = '';
                        commentBox.style.display = 'none';
                        alert("comment has been added");
                    }
                    else{
                        alert("Please enter comment and than click outside the box!");
                    }
                }).catch((error) => {
                    alert("Error: " + error);
                });
                const commentBoxReset = document.getElementById('commentBox'+feedsPosts[i].id);
                commentBoxReset.value = "";
            };
        };


        // liked by button
        likedByButton.type = "button";
        likedByButton.innerText = "Liked By"
        likedByButton.id = "postLikedByButton" + feedsPosts[i];
        likedByButton.classList.add("postButton");
        likedByButton.onclick = () => {
            
            let likedByListNames = getUsernames(authToken, feedsPosts[i].meta.likes);
            //console.log("Names:" + likedByListNames);
/////////////////////////// THIS LIKE NOT WORKING/////////////////////////////////////////////////////////////////////////////////////////////////////////////
            const mapEntries = likedByListNames.entries();
            //console.log(mapEntries.value);

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
        commentedByButton.innerText = "Commented by: " + feedsPosts[i].comments.length + " people" ;
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
        newIMG.classList.add('image');
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
function userFeeds(authToken, x) {
    const feedsResult = fetch('http://localhost:5000/user/feed?p='+ x , {
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
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                document.getElementById('homeButton').addEventListener('click',() => {
                    const userFeedsShowHome = document.getElementById('userFeedsShow');
                    const userProfileHome = document.getElementById('userProfile');
                    const clearProfilePage = document.querySelector('.userProfilePost');
                    const clearProfilePagePost = document.querySelector('.userProfilePosts');
                    const NewPostDisp = document.getElementById('NewPost');
                    const updateProfileDisp = document.getElementById('updateProfile');
                    updateProfileDisp.style.display = 'none';
                    NewPostDisp.style.display = 'none';
                    userProfileHome.style.display = 'none';
                    userFeedsShowHome.style.display = 'block';
                    if(clearProfilePage != null){
                        userProfileHome.removeChild(clearProfilePage);
                        userProfileHome.removeChild(clearProfilePagePost);
                    }
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
                    globalauthToken = loginResult.token; // setting it to use it in all other functions
                    globalauthToken = loginResult.token;
                    userFeeds(loginResult.token, 0);
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
                        globalauthToken = registerResult.token;
                        userFeeds(registerResult.token);
                    });
                    registerPage.style.display = "none";
    
                    let feeds = document.getElementById('userFeeds');
                    feeds.style.display = "block";
                }
            }).catch ((Error) => {
                alert(Error);
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
            'description_text': document.getElementById('newPostStatus').value,
            'src': document.getElementById('newPostImageSource').value,
        };

        fetch('http://localhost:5000/post/', {
            method: 'POST',
            headers: {
                'Authorization': 'Token ' + globalauthToken,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newPostBody)
        }).then((data) => {
            if(data.status == 200) {
                newPost.style.display = "none";
                feedsPage.style.display = "block";
                document.getElementById("newPostStatus").value = '';
                document.getElementById('newPostImageSource').value = '';
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


// Update profile details
document.getElementById('updateProfileButton').addEventListener('click', () => {
    // presents the form for filling the info
    const updateForm = document.getElementById('updateProfile');
    const feedsPage = document.getElementById('userFeedsShow');
    feedsPage.style.display = 'none';
    updateForm.style.display = 'block';

    document.getElementById('updateProfileSubmit').addEventListener('click', () => {
        const updateInfo = {
            'email': document.getElementById('updateProfileEmail').value,
            'name': document.getElementById('updateProfileName').value,
            'password': document.getElementById('updateProfilePassword').value
        };

        const updateUserInfo = fetch('http://localhost:5000/user/', {
            method: 'PUT',
            headers: {
                'Authorization': 'Token ' + globalauthToken,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateInfo)
        }).then((data) => {
            if(data.status == 200) {
                alert("Your information is updated!");
                feedsPage.style.display = 'block';
                updateForm.style.display = 'none';
            }
            else {
                feedsPage.style.display = 'block';
                updateForm.style.display = 'none';

                alert("not updated yet!");
            }
        }).catch((error) => {
            alert(error);
        });
    });

    document.getElementById('updateProfileCancel').addEventListener('click', () => {
        feedsPage.style.display = 'block';
        updateForm.style.display = 'none';
    });
});

function deletePost(authToken, postId) {
    fetch('http://localhost:5000/post/?id=' + postId, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Token ' + authToken,
            'Content-Type': 'application/json',
        }
    }).then((data) => {
        if(data.status == 200) {
            alert("Post has been deleted");
        }
    }).catch((Error) => {
        alert(Error);
    });
}


///////////////////////////////////////////////////////////////
function authorPostsDisplay(profilePosts, profilePage, authorName, authorPostDiv) {
    for(let i = 0; i < profilePosts.length; i++) {
        const newPostDiv = document.createElement("div");
        const newP1 = document.createElement("p");
        const newP2 = document.createElement("p");
        const newIMG = document.createElement("img");
        newIMG.classList.add('image');
        newIMG.alt = "Image Not Compatible";
        const newP4 = document.createElement("p");
        const newP5 = document.createElement("p");
        const newP6 = document.createElement("p");
        let likeButton = document.createElement("button");
        let commentButton = document.createElement("button");
        let likedByButton = document.createElement("button");
        let commentedByButton = document.createElement("button");
        let commentBox = document.createElement("input");
        const editBox = document.createElement('input');
        editBox.id = profilePosts[i] + "editBox";
        editBox.style.display = 'none';
        const userEditPost = document.createElement('button');
        userEditPost.innerText = 'Edit Post';
        userEditPost.id = profilePosts[i] + "editId";
        userEditPost.classList.add('deletePostButton');
        userEditPost.onclick = () => {
            editBox.style.display = 'block';
            editBox.classList.add('commentBox');
            editBox.placeholder = 'New Status';
            //editPost(globalauthToken, editBox, profilePosts[i]);
                editBox.onblur = () => {
                    const editStatus = {
                        'description_text': document.getElementById(profilePosts[i] + "editBox").value
                    };
                    fetch('http://localhost:5000/post/?id='+profilePosts[i], {
                        method: 'PUT',
                        headers: {
                            'Authorization': 'Token ' + globalauthToken,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(editStatus)
                    }).then((data) => {
                        if(data.status == 200) {
                            document.getElementById(profilePosts[i] + "editBox").value = '';
                            editBox.style.display = 'none';
                            alert("Post editted successfully!");
                        }
                        
                    }).catch((Error) => {
                        alert(Error);
                    });
            };
            
        };

        const userDeletePost = document.createElement('button');
        userDeletePost.innerText = 'Delete Post';
        userDeletePost.id = profilePosts[i] + "deleteId";
        userDeletePost.classList.add('deletePostButton');
        userDeletePost.onclick = () => {
            //console.log('Post deleted');
            deletePost(globalauthToken, profilePosts[i]);
        };

        commentBox.style.display = "none";
        commentBox.classList.add("commentBox");
        commentBox.id = "commentBox" + profilePosts[i];


        // content of the post to be shown
        newP1.innerText = "👬" + authorName;
        newP1.id =authorName + "id";
        newP1.style.color = "white";

        // fetch request to get the entire post
        const entirePost = fetch('http://localhost:5000/post/?id=' + profilePosts[i], {
            method: 'GET',
            headers: {
                'Authorization': 'Token ' + globalauthToken,
                'Content-Type': 'application/json',
            }
        }).then((data) => {
            if(data.status == 200){
                data.json().then((entirePost) => {
                    newP2.innerText = "Posted At: " + entirePost.meta.published;

                    newP4.id = "postLike" + entirePost.id;
                    newP4.style.display = "none";

                    newP5.innerText = "Status: " + entirePost.meta.description_text;

                    if(entirePost.comments.length != 0){
                        newP6.innerText = entirePost.comments[0].author + ": " + entirePost.comments[0].comment;
                        for(let j = 1; j < entirePost.comments.length; j++) {
                            newP6.innerText = newP6.innerText + ", " + entirePost.comments[j].author + ": " + entirePost.comments[j].comment;
                    }   }
                    else{
                        newP6.innerText = "No comments yet!";
                    }
                    newP6.style.display = "none";

                    // like/ Unlike button
                    likeButton.type = "button";
                    likeButton.innerText = "💗 Like";
                    likeButton.id = "postLikeButton" + entirePost.id;
                    likeButton.classList.add("postButton");
                    likeButton.onclick = () => {
                        likePostFunction(likeButton, entirePost.id, globalauthToken);
                    };

                    // comment button (Works)
                    commentButton.type = "button";
                    commentButton.innerText = "💬 𝘤𝘰𝘮𝘮𝘦𝘯𝘵";
                    commentButton.id = "postCommentButton" + entirePost.id;
                    commentButton.classList.add("postButton");
                    commentButton.onclick = () => {
                        commentBox.style.display = "block";
                        commentBox.onblur = () => {
                                const commentWords = {
                                "comment": document.getElementById('commentBox' + entirePost.id).value,
                            };
                            const commentedByUser = fetch('http://localhost:5000/post/comment?id=' + entirePost.id, {
                                method: 'PUT',
                                headers: {
                                    'Authorization': 'Token ' + globalauthToken,
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
                            const commentBoxReset = document.getElementById('commentBox'+entirePost.id);
                            commentBoxReset.value = "";
                        };
                    };

                    // liked by button
                    likedByButton.type = "button";
                    likedByButton.innerText = "Liked By"
                    likedByButton.id = "postLikedByButton" + entirePost[i];
                    likedByButton.classList.add("postButton");
                    likedByButton.onclick = () => {
                        
                        let likedByListNames = getUsernames(globalauthToken, entirePost.meta.likes);
                        //console.log("Names:" + likedByListNames);
            /////////////////////////// THIS LIKE NOT WORKING/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                        const mapEntries = likedByListNames.entries();
                        //console.log(mapEntries.value);

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
                    commentedByButton.innerText = "Commented by: ";
                    commentedByButton.id = "commentedByButton" + entirePost[i];
                    commentedByButton.classList.add("postButton");
                    commentedByButton.onclick = () => {
                        if(newP6.style.display == "none") {
                            newP6.style.display = "block";
                        }else {
                            newP6.style.display = "none";
                        }
                    };

                     // providing the source to the image
                    let postImg = entirePost.src;
                    newIMG.src = "data:image/jpeg;base64," + postImg;
                });
            }
            else{
                alert("Post not got");
            }
        }).catch((Error) => {
            alert(Error);
        });

        // append everything
        // adding everything to the div
        newPostDiv.appendChild(newP1);
        newPostDiv.appendChild(newP2);
        
        newPostDiv.appendChild(newIMG);
        newPostDiv.appendChild(newP5);
        newPostDiv.appendChild(newP4);
        newPostDiv.appendChild(newP6);
        newPostDiv.appendChild(likeButton);
        newPostDiv.appendChild(commentButton);
        newPostDiv.appendChild(likedByButton);
        newPostDiv.appendChild(commentedByButton);
        newPostDiv.appendChild(commentBox);
        newPostDiv.appendChild(userEditPost);
        newPostDiv.appendChild(userDeletePost);
        newPostDiv.appendChild(editBox);
        newPostDiv.classList.add("eachPost");
        authorPostDiv.appendChild(newPostDiv);
        
    }
    profilePage.appendChild(authorPostDiv);
}


// Show user's own profile
document.getElementById('authorProfile').addEventListener('click', () => {
    const authorProfileDiv = document.createElement('div');
    const authorPostDiv = document.createElement('div');
    authorPostDiv.classList.add('userProfilePosts');
    authorProfileDiv.classList.add('userProfilePost');
    const authorProfileName = document.createElement('p');
    const authorProfileEmail = document.createElement('p');
    const authorProfileFollowers = document.createElement('p');
    const authorProfileFollowing = document.createElement('p');
    const profilePage = document.getElementById('userProfile');
    const feedsShowPage = document.getElementById('userFeedsShow');
    
    
    feedsShowPage.style.display = 'none';
    profilePage.style.display = 'block';

    const authorProfile = fetch('http://localhost:5000/user/', {
        method: 'GET',
        headers: {
            'Authorization': 'Token ' + globalauthToken,
            'Content-Type': 'application/json',
        },
    }).then((data) => {
        if(data.status == 200) {
            data.json().then((authorProfile) => {
                authorProfileName.innerText = authorProfile.name;
                authorProfileEmail.innerText = authorProfile.email;
                authorProfileFollowers.innerText = "Followers: " + authorProfile.followed_num;
                //authorProfileFollowing = "Following: " + authorProfile.following.length;
                authorPostsDisplay(authorProfile.posts, profilePage, authorProfile.name, authorPostDiv);
            });
        }
    }).catch((Error) => {
        alert(Error);
    });

    authorProfileDiv.appendChild(authorProfileName);
    authorProfileDiv.appendChild(authorProfileEmail);
    authorProfileDiv.appendChild(authorProfileFollowers);
    //authorProfileDiv.appendChild(authorProfileFollowing);
    profilePage.appendChild(authorProfileDiv);
});

// call the method on scroll (INFINITE Scroll)
window.addEventListener('scroll', () => {
    if(window.scrollY > x*1000) {
        x = x + 10;
        userFeeds(globalauthToken, x);
    };
});
