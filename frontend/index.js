const signupPage = document.getElementById('signup-page');
        const signInPage = document.getElementById('signIn-page');
        const modePage = document.getElementById('mode-page');
        const teamPage = document.getElementById('team-page');
        const gamePage = document.getElementById('game-page');
        const joiningPage = document.getElementById('joining-page');
        const instructionsPage=document.getElementById('instructions-page');
        const leaderboardPage = document.getElementById('leaderboard-page');
        
        const signupBtn = document.getElementById('signup-btn');
        const signInBtn = document.getElementById('signIn-btn');
        const goToSignIn = document.getElementById('go-to-signIn');
        const goToSignup = document.getElementById('go-to-signup');
        const createTeamBtn = document.getElementById('create-team-btn');
        const teamCodeDisplay=document.getElementById('team-code');
        const joinTeamBtn = document.getElementById('join-team-btn');
        const joinTeamFinalBtn=document.getElementById('join-team-final-btn');
        const individualBtn = document.getElementById('individual-btn');
        const createTeamFinalBtn = document.getElementById('create-team-final-btn');
        const startGameBtn = document.getElementById('start-game-btn');
        const submitAnswersBtn = document.getElementById('submit-answers-btn');
        const viewLeaderboardBtn = document.getElementById('view-leaderboard-btn');
        const playAgainBtn = document.getElementById('play-again-btn');
        const backToGameBtn = document.getElementById('back-to-game-btn');
        
        // const gameInstructions = document.getElementById('game-instructions');
        const gameArea = document.getElementById('game-area');
        const gameResult = document.getElementById('game-result');
        const timerDisplay = document.getElementById('timer');
        const scoreDisplay = document.getElementById('score');
        const resultMessage = document.getElementById('result-message');
        const teamsContainer = document.getElementById('teams-container');
        const leaderboard = document.getElementById('leaderboard');
        const domainContainer = document.getElementById('domain-container');
        
        // Game State
        let timeLeft = 60;
        let timerInterval;
        let score = 0;
        let gameActive = false;
        let currentUser = null;
        let currentTeam = null;
        let teams = [];
        let users = [];
        let individualScores = [];
        let domains = [];
        let revealedDomains = 0;
        let guessedDomains = []; // Track which domains have been guessed correctly
        
        // ✅ Rehydrate user info (if already signed in earlier)
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            currentUser = JSON.parse(savedUser);
            console.log('Loaded user from storage:', currentUser);
        }

        // Domain data - in FRONTEND for this game
        const domainData = [
            { name: "Artificial Intelligence (AI) & Machine Learning (ML)", points: 10 },
            { name: "Cloud Computing", points: 10 },
            { name: "Cybersecurity", points: 10 },
            { name: "Mobile App Development", points: 10 },
            { name: "Web Development", points: 10 },
            { name: "Data Science & Analytics", points: 10 },
            { name: "Software Development & Systems Engineering", points: 10 },
            { name: "DevOps & Automation", points: 10 },
            { name: "Game Development", points: 10 },
            { name: "Blockchain & Web3", points: 10 }
        ];
        
        // Event Listeners
        
        goToSignIn.addEventListener('click', () => showPage(signInPage));
        goToSignup.addEventListener('click', () => showPage(signupPage));
        createTeamBtn.addEventListener('click', () => showPage(teamPage));
        individualBtn.addEventListener('click', ()=>showPage(instructionsPage));
        joinTeamBtn.addEventListener('click',()=>showPage(joiningPage));
        startGameBtn.addEventListener('click', startGame);
        submitAnswersBtn.addEventListener('click', submitAnswers);
        viewLeaderboardBtn.addEventListener('click', () => {
            updateLeaderboard();
            showPage(leaderboardPage);
        });
        playAgainBtn.addEventListener('click', playAgain);
        backToGameBtn.addEventListener('click', () => showPage(modePage));
        
        // Functions
        function showPage(page) {
            // Hide all pages
            signupPage.classList.remove('active');
            signInPage.classList.remove('active');
            modePage.classList.remove('active');
            teamPage.classList.remove('active');
            gamePage.classList.remove('active');
            leaderboardPage.classList.remove('active');
            instructionsPage.classList.remove('active');
            // Show the requested page
            page.classList.add('active');
        }
        
        signupBtn.addEventListener('click', (e)=>{
            const signUpForm = document.getElementById('signupForm');
            
            e.preventDefault();
            console.log('form submitted');
            const formData=new FormData(signUpForm);
            const dataObject=Object.fromEntries(formData);
            fetch('http://localhost:8000/alphaQuest/signUp' ,{
                method:'POST',
                headers:{
                    'content-type':'application/json',
                },
                body:JSON.stringify(dataObject)
            })
            .then((response)=>{
                console.log('response recieved');
                return response.json()
            })
            .then((data)=>{
                console.log('response saved:');
                alert('(' + data.status + ') ' + data.message);
                if (data.message==="SignUp successful! Sign in to play!"||data.message==="Player already signed Up, sign in to play.")
                    showPage(signInPage);
                
            })
            .catch((error)=>console.error(error));
                
           
        });
        
        signInBtn.addEventListener('click', (e)=>{
            const signInForm=document.getElementById('signInForm');
            e.preventDefault();
            console.log('form submitted!');
            const formData=new FormData(signInForm);
            const dataObject=Object.fromEntries(formData);
            fetch('http://localhost:8000/alphaQuest/signIn',{
                method:'POST',
                headers:{
                    'content-type':'application/json',
                },
                body:JSON.stringify(dataObject)
            })
            .then((response)=>{
                console.log('response recieved!');
                return response.json()
            })
            .then((data)=>{
                console.log('response saved!');
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    console.log('Token stored:', data.token);
                }
                if (data.user) {
                    currentUser = data.user; // ✅ global variable
                    localStorage.setItem('user', JSON.stringify(data.user)); // optional persistence
                    console.log('User stored:', data.user);
                }
                if (data.message=='Signed in successfully!'){
                    showPage(modePage);
                }else if(data.message=="We couldn't find you in signed up players! Sign up first!"){
                    alert('(' + data.status + ')' + data.message);
                    showPage(signupPage);
                }
                else{
                    alert('(' + data.status + ')' + data.message);
                }
            })
        });
        
        createTeamFinalBtn.addEventListener('click', (e)=>{
            const teamForm=document.getElementById('teamForm');
            e.preventDefault();
            console.log('form submitted');
            const formData=new FormData(teamForm);
            const dataObject=Object.fromEntries(formData);
            const token = localStorage.getItem('token');
            fetch('http://localhost:8000/alphaQuest/createTeam',{
                method:'POST',
                headers:{
                    'content-type':'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body:JSON.stringify(dataObject)
            }).then((response)=>{
                console.log('response recieved');
                return response.json()
            }).then((data)=>{
                console.log('response saved');
                alert('(' + data.status + ')' + data.message);
                if (data.message=="Team created successfully!") {
                    // Success — show the team code to user
                    teamCodeDisplay.innerHTML = `
                    <div id="generated-team-info">
                    <h2>Team ID: <span style="color: #00ffcc;">${data.teamCode}</span></h2></div>
                    <div id="instructions">
                    > Tell your friends to enter this team code after clicking on <strong>Join Team</strong>, after signing in.<br>
                    > <strong>READ INSTRUCTIONS CAREFULLY, BEFORE YOU START!</strong><br>
                    * the game is timed for 3 minutes, which start as soon as you click on <strong>start game</strong>.<br>
                    * Rules:<br>
                    * You will have to guess the names of top 10 trending domains of software engineering.<br>
                    * Each correct guess earns you 10 points!<br>
                    * Your <strong>first score</strong> determines your position in the leaderboard(common for both team and individual players).<br>
                    * Though, you may play the game again, if you wish to!<br>
                    * <i>hope you have a great experience playing this game!</i><br>
                    <button class="btn" id="start-team-game-btn">START GAME</button>
                    </div>
                    `;

  document.getElementById('start-team-game-btn').addEventListener('click', () => {

    currentTeam = {
        teamId: data.teamId,   // from the response when creating/joining team
        teamName: data.teamName
    };
     console.log("Current Team set to:", currentTeam);
  showPage(gamePage);
  startGame(); // ✅ initialize the game properly

  });
}

            })
        });
        
        joinTeamFinalBtn.addEventListener('click', (e)=>{
            const joinTeamPage= document.getElementById('join-team-code');
            e.preventDefault();
            console.log('form submitted.');
            const joinTeamForm=document.getElementById('joinTeamForm');
            const formData=new FormData(joinTeamForm);
            const dataObject=Object.fromEntries(formData);
            const token = localStorage.getItem('token');
            fetch('http://localhost:8000/alphaQuest/joinTeam',{
                method:'POST',
                headers:{
                    'content-type':'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body:JSON.stringify(dataObject)
            }).then((response)=>{
                console.log('response recieved.');
                return response.json()
            }).then((data)=>{
                console.log('response saved.');
                alert('(' + data.status + ')' + data.message);
                if(data.message=="team joined successfully!"){
                    joinTeamPage.innerHTML=`
                    <div id="joined-team-info">
                    <h2>WELCOME TO TEAM: <span style="color: #00ffcc;">${data.teamName}</span></h2></div>
                    <div id="instructions">
                    > You can play as a team on your friend's (team creator) device.<br>
                    > <strong>READ INSTRUCTIONS CAREFULLY, BEFORE YOU START!</strong><br>
                    * the game is timed for 3 minutes, which start as soon as you click on <strong>start game</strong>.<br>
                    * Rules:<br>
                    * You will have to guess the names of top 10 trending domains of software engineering.<br>
                    * Each correct guess earns you 10 points!<br>
                    * Your <strong>first score</strong> determines your position in the leaderboard(common for both team and individual players).<br>
                    * Though, you may play the game again, if you wish to!<br>
                    * <i>hope you have a great experience playing this game!</i><br>
                    </div>
                    `;
                }
            })
            

        });
        
        function playAgain() {
            if (currentTeam) {
                // Check if this specific team has already played
                const teamInList = teams.find(t => t.id === currentTeam.id);
                if (teamInList && teamInList.played) {
                    alert('This team has already played. Please create a new team or join another team to play again.');
                    showPage(modePage);
                    return;
                }
            }
            
            // Reset game for play again
            resetGame();
            showPage(gamePage);
        }
        // Attach global guess button listener after DOM loads
document.addEventListener('DOMContentLoaded', () => {
    const guessBtn = document.getElementById('global-guess-btn');
    if (guessBtn) {
        guessBtn.addEventListener('click', handleGlobalGuess);
    }
});

// Helper: show a small feedback message under the guess bar
function showGuessFeedback(text, type = 'info') {
  // try to find an existing feedback element
  let el = document.getElementById('guess-feedback');
  if (!el) {
    el = document.createElement('div');
    el.id = 'guess-feedback';
    el.style.marginTop = '8px';
    el.style.textAlign = 'center';
    el.style.fontWeight = '700';
    el.style.fontSize = '0.95rem';
    // insert it after the global-guess-bar
    const bar = document.getElementById('global-guess-bar');
    if (bar) bar.parentNode.insertBefore(el, bar.nextSibling);
    else document.body.appendChild(el);
  }

  el.textContent = text;
  el.className = ''; // reset classes
  el.classList.add('guess-feedback', type);

  // remove after 1.8s
  clearTimeout(el._timeoutId);
  el._timeoutId = setTimeout(() => {
    el.textContent = '';
    el.className = '';
  }, 1800);
}

// Main handler (drop-in replacement)
function handleGlobalGuess() {
  if (!gameActive) {
    showGuessFeedback('Start the game first!', 'error');
    return;
  }

  const inputEl = document.getElementById('global-guess-input');
  const raw = inputEl.value.trim().toLowerCase();
  if (!raw) {
    showGuessFeedback('Please enter a guess', 'error');
    return;
  }

  const userGuess = raw;
  let matchedIndex = -1;

  // Search through domains in order
  for (let i = 0; i < domains.length; i++) {
        const domainNameNorm = domains[i].name.toLowerCase();

        if ((domainNameNorm.includes(raw) || raw.includes(domainNameNorm)) && !guessedDomains.includes(i)) {
            matchedIndex = i;
            break;
        }

    // fuzzy fallback
    if (checkCloseMatch(userGuess, domainNameNorm) && !guessedDomains.includes(i)) {
      matchedIndex = i;
      break;
    }
  }

  // handle matched or wrong case
  if (matchedIndex !== -1) {
    const domain = domains[matchedIndex];

    // mark as guessed
    guessedDomains.push(matchedIndex);
    revealedDomains++;
    score += domain.points;
    scoreDisplay.textContent = score;

     // ✅ Correct mapping to DOM elements
    const domainItem = domainContainer.querySelector(`.domain-item:nth-child(${matchedIndex + 1})`);
        const tape = domainItem.querySelector('.domain-tape');
        const nameEl = domainItem.querySelector('.domain-name');


    if (tape) tape.classList.add('revealed');
    if (nameEl) nameEl.classList.add('revealed');
    if (domainItem) domainItem.classList.add('correct');

    // success feedback
    showGuessFeedback(`✅ Correct — ${domain.name}`, 'success');

    // if all guessed, end
    if (guessedDomains.length === domains.length) {
      setTimeout(endGame, 800);
    }
  } else {
    // wrong guess
    showGuessFeedback(`❌ No match for “${raw}”`, 'error');
  }

  inputEl.value = '';
  inputEl.focus();
}



        // function updateTeamsDisplay() {
        //     if (teams.length === 0) {
        //         teamsContainer.innerHTML = `
        //             <div class="empty-state">
        //                 <i class="fas fa-users"></i>
        //                 <p>No teams created yet. Be the first to create one!</p>
        //             </div>
        //         `;
        //         return;
        //     }
            
        //     teamsContainer.innerHTML = '';
        //     teams.forEach(team => {
        //         const teamCard = document.createElement('div');
        //         teamCard.className = 'team-card';
        //         teamCard.innerHTML = `
        //             <div class="team-name">${team.name} ${team.played ? '(Played)' : ''}</div>
        //             <div class="team-members">${team.members.join(', ')}</div>
        //         `;
        //         teamsContainer.appendChild(teamCard);
        //     });
        // }
        
        function updateLeaderboard() {
            // Combine team scores and individual scores
            const allScores = [
                ...teams.map(team => ({ name: team.name, score: team.score, type: 'team' })),
                ...individualScores.map(score => ({ name: score.userName, score: score.score, type: 'individual' }))
            ];
            
            // Sort by score (descending)
            const sortedScores = allScores.sort((a, b) => b.score - a.score);
            
            if (sortedScores.length === 0) {
                leaderboard.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-trophy"></i>
                        <p>No one has completed the challenge yet!</p>
                    </div>
                `;
                return;
            }
            
            leaderboard.innerHTML = '';
            sortedScores.forEach((entry, index) => {
                const listItem = document.createElement('li');
                const typeIcon = entry.type === 'team' ? '<i class="fas fa-users"></i> ' : '<i class="fas fa-user"></i> ';
                listItem.innerHTML = `
                    <span>${typeIcon}${entry.name}</span>
                    <span>${entry.score} POINTS</span>
                `;
                leaderboard.appendChild(listItem);
            });
        }
        
        function startGame() {
  
  gameArea.style.display = 'block';
  gameActive = true;

  initializeDomains(); // freshly creates domains
  startTimer();

  document.getElementById('start-game-btn').style.display = 'none';
  document.getElementById('global-guess-bar').style.display = 'flex';
//   document.getElementById('global-guess-area').style.display = 'block';

  const guessInput = document.getElementById('global-guess-input');
  guessInput.value = '';
  guessInput.focus();

  const guessBtn = document.getElementById('global-guess-btn');
  guessBtn.removeEventListener('click', handleGlobalGuess);
  guessBtn.addEventListener('click', handleGlobalGuess);

  console.log("Game started — listener attached.");
}

        
        function initializeDomains() {
    domainContainer.innerHTML = '';

    // Use domainData in original order
    domains = [...domainData]; 

    revealedDomains = 0;
    score = 0;
    guessedDomains = []; // Reset guessed domains
    scoreDisplay.textContent = score;

    domains.forEach((domain, index) => {
        const domainItem = document.createElement('div');
        domainItem.className = 'domain-item';
        domainItem.innerHTML = `
            <div class="points">${domain.points} pts</div>
            <div class="domain-tape" data-index="${index}">
                <span>Hidden Domain</span>
            </div>
            <div class="domain-name" data-index="${index}">${domain.name}</div>
        `;
        domainContainer.appendChild(domainItem);
    });
}



        
        
        
        function checkCloseMatch(guess, domainName) {
            // Simple fuzzy matching for common variations
            const mappings = {
                'ai': 'artificial intelligence',
                'ml': 'machine learning',
                'web': 'web development',
                'app': 'app development',
                'mobile app dev': 'mobile app',
                'data': 'data science',
                'software': 'software development',
                'cloud': 'cloud computing',
                'cyber': 'cybersecurity',
                'blockchain': 'blockchain',
                'web3': 'web3',
                'devops': 'devops',
                'automation': 'automation',
                'game': 'game development'
            };
            
            return Object.keys(mappings).some(key => 
                guess.includes(key) && domainName.includes(mappings[key])
            );
        }
        
        function startTimer() {
            timeLeft = 180;
            timerDisplay.textContent = `03:00`;
            timerDisplay.style.color = '#4d7fff';
            
            timerInterval = setInterval(() => {
                timeLeft--;
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                
                // Change color when time is running out
                if (timeLeft <= 10) {
                    timerDisplay.style.color = '#f44336';
                    timerDisplay.style.animation = 'timerPulse 0.5s infinite alternate';
                }
                
                // Time's up
                if (timeLeft <= 0) {
                    endGame();
                }
            }, 1000);
        }
        
        function endGame() {
            clearInterval(timerInterval);
            gameActive = false;
            
            // Update scores
            if (currentTeam) {
                currentTeam.score = score;
                currentTeam.played = true;
            } else {
                individualScores.push({
                    userName: currentUser.name,
                    score: score
                });
            }
            
            // // Reveal all domains that weren't guessed
            // document.querySelectorAll('.domain-tape').forEach(tape => {
            //     tape.style.display = 'none';
            // });
            // document.querySelectorAll('.guess-input-container').forEach(container => {
            //     container.classList.add('active');
            // });
            // document.querySelectorAll('.domain-name').forEach(name => {
            //     name.classList.add('revealed');
            // });

            // Inside endGame() before showing results:
            document.getElementById('global-guess-bar').style.display = 'none';

            
            // Show result
            gameArea.style.display = 'none';
            gameResult.style.display = 'block';
            
            if (score >= 70) {
                resultMessage.textContent = `EXCELLENT! YOU SCORED ${score} POINTS AND REVEALED ${revealedDomains}/10 DOMAINS.`;
                resultMessage.className = 'game-status success';
                createConfetti();
            } else if (score >= 40) {
                resultMessage.textContent = `GOOD EFFORT! YOU SCORED ${score} POINTS AND REVEALED ${revealedDomains}/10 DOMAINS.`;
                resultMessage.className = 'game-status';
            } else {
                resultMessage.textContent = `YOU SCORED ${score} POINTS AND REVEALED ${revealedDomains}/10 DOMAINS. KEEP PRACTICING!`;
                resultMessage.className = 'game-status error';
            }
            sendScoreToBackend(score);
        }

        function sendScoreToBackend(finalScore) {
    const token = localStorage.getItem('token');
    if (!token) return console.warn("No token found; score not sent.");
    const payload = { score: finalScore };

    // Include team info if playing as a team
    if (currentTeam) {
        payload.teamId = currentTeam._id; // or currentTeam.teamCode depending on your DB
    }

    
    fetch('http://localhost:8000/alphaQuest/submitScore', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)   // ✅ send the actual payload
    })
    .then(res => res.json())
    .then(data => console.log('Score saved:', data))
    .catch(err => console.error('Error saving score:', err));
}

        
        function submitAnswers() {
            endGame();
        }
        
        function resetGame() {
    // Reset game state
    timeLeft = 180;
    score = 0;
    gameActive = false;
    revealedDomains = 0;
    guessedDomains = [];

    // Reset UI
    timerDisplay.textContent = '03:00';
    timerDisplay.style.color = '#4d7fff';
    scoreDisplay.textContent = '0';

    // Clear domain container
    initializeDomains();

    gameResult.style.display = 'none';
    gameArea.style.display = 'block';
    document.getElementById('start-game-btn').style.display = 'none';
    document.getElementById('global-guess-bar').style.display = 'flex';
}

        
        // function shuffleArray(array) {
        //     const newArray = [...array];
        //     for (let i = newArray.length - 1; i > 0; i--) {
        //         const j = Math.floor(Math.random() * (i + 1));
        //         [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        //     }
        //     return newArray;
        // }
        
        function createConfetti() {
            const colors = ['#0023FF', '#4d7fff', '#0018a8', '#020824'];
            for (let i = 0; i < 50; i++) {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.width = Math.random() * 10 + 5 + 'px';
                confetti.style.height = Math.random() * 10 + 5 + 'px';
                confetti.style.animationDelay = Math.random() * 5 + 's';
                document.body.appendChild(confetti);
                
                // Remove confetti after animation
                setTimeout(() => {
                    confetti.remove();
                }, 5000);
            }
        }
        
        // Initialize teams display
        updateTeamsDisplay();