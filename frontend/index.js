const signupPage = document.getElementById('signup-page');
        const signInPage = document.getElementById('signIn-page');
        const modePage = document.getElementById('mode-page');
        const teamPage = document.getElementById('team-page');
        const gamePage = document.getElementById('game-page');
        const leaderboardPage = document.getElementById('leaderboard-page');
        
        const signupBtn = document.getElementById('signup-btn');
        const signInBtn = document.getElementById('signIn-btn');
        const goToSignIn = document.getElementById('go-to-signIn');
        const goToSignup = document.getElementById('go-to-signup');
        const createTeamBtn = document.getElementById('create-team-btn');
        const joinTeamBtn = document.getElementById('join-team-btn');
        const individualBtn = document.getElementById('individual-btn');
        const createTeamFinalBtn = document.getElementById('create-team-final-btn');
        const startGameBtn = document.getElementById('start-game-btn');
        const submitAnswersBtn = document.getElementById('submit-answers-btn');
        const viewLeaderboardBtn = document.getElementById('view-leaderboard-btn');
        const playAgainBtn = document.getElementById('play-again-btn');
        const backToGameBtn = document.getElementById('back-to-game-btn');
        
        const gameInstructions = document.getElementById('game-instructions');
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
        signupBtn.addEventListener('click', signup);
        signInBtn.addEventListener('click', signIn);
        goToSignIn.addEventListener('click', () => showPage(signInPage));
        goToSignup.addEventListener('click', () => showPage(signupPage));
        createTeamBtn.addEventListener('click', () => showPage(teamPage));
        joinTeamBtn.addEventListener('click', joinTeam);
        individualBtn.addEventListener('click', playIndividually);
        createTeamFinalBtn.addEventListener('click', createTeam);
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
            
            // Show the requested page
            page.classList.add('active');
        }
        
        function signup() {
            const userName = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            
            if (userName && email && password) {
                // Check if user already exists
                if (users.find(user => user.email === email)) {
                    alert('User with this email already exists. Please sign in instead.');
                    return;
                }
                
                // Create new user
                const newUser = {
                    userName,
                    email,
                    password,
                    id: Date.now()
                };
                
                users.push(newUser);
                currentUser = newUser;
                
                showPage(modePage);
            } else {
                alert('Please fill in all fields.');
            }
        }
        
        function signIn() {
            const email = document.getElementById('login-name').value;
            const password = document.getElementById('login-password').value;
            
            if (email && password) {
                // Find user
                const user = users.find(u => u.email === email && u.password === password);
                
                if (user) {
                    currentUser = user;
                    showPage(modePage);
                } else {
                    alert('Invalid email or password. Please try again.');
                }
            } else {
                alert('Please enter both email and password.');
            }
        }
        
        function createTeam() {
            const teamName = document.getElementById('team-name').value;
            const teamMembers = document.getElementById('team-members').value;
            
            if (teamName && teamMembers) {
                // Create new team
                const newTeam = {
                    name: teamName,
                    members: teamMembers.split(',').map(m => m.trim()),
                    score: 0,
                    id: Date.now(),
                    played: false
                };
                
                teams.push(newTeam);
                currentTeam = newTeam;
                
                // Update teams display
                updateTeamsDisplay();
                
                showPage(gamePage);
            } else {
                alert('Please enter both team name and members.');
            }
        }
        
        function joinTeam() {
            if (teams.length === 0) {
                alert('No teams available to join. Create a new team instead.');
                return;
            }
            
            // Show team selection modal (simplified for demo)
            let teamList = "Available Teams:\n";
            teams.forEach((team, index) => {
                teamList += `${index + 1}. ${team.name} (${team.played ? 'Played' : 'Not Played'})\n`;
            });
            
            const teamChoice = prompt(`${teamList}\nEnter the number of the team you want to join:`);
            const teamIndex = parseInt(teamChoice) - 1;
            
            if (teamIndex >= 0 && teamIndex < teams.length) {
                const selectedTeam = teams[teamIndex];
                
                if (selectedTeam.played) {
                    alert('This team has already played. Please select another team.');
                    return;
                }
                
                currentTeam = selectedTeam;
                showPage(gamePage);
            } else {
                alert('Invalid team selection.');
            }
        }
        
        function playIndividually() {
            currentTeam = null;
            showPage(gamePage);
        }
        
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
        
        function updateTeamsDisplay() {
            if (teams.length === 0) {
                teamsContainer.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-users"></i>
                        <p>No teams created yet. Be the first to create one!</p>
                    </div>
                `;
                return;
            }
            
            teamsContainer.innerHTML = '';
            teams.forEach(team => {
                const teamCard = document.createElement('div');
                teamCard.className = 'team-card';
                teamCard.innerHTML = `
                    <div class="team-name">${team.name} ${team.played ? '(Played)' : ''}</div>
                    <div class="team-members">${team.members.join(', ')}</div>
                `;
                teamsContainer.appendChild(teamCard);
            });
        }
        
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
            gameInstructions.style.display = 'none';
            gameArea.style.display = 'block';
            gameActive = true;
            
            // Initialize domains
            initializeDomains();
            
            // Start the timer
            startTimer();
        }
        
        function initializeDomains() {
            domainContainer.innerHTML = '';
            domains = [...domainData];
            revealedDomains = 0;
            score = 0;
            guessedDomains = []; // Reset guessed domains
            scoreDisplay.textContent = score;
            
            // Shuffle domains for variety
            domains = shuffleArray(domains);
            
            // Create domain items
            domains.forEach((domain, index) => {
                const domainItem = document.createElement('div');
                domainItem.className = 'domain-item';
                domainItem.innerHTML = `
                    <div class="points">${domain.points} pts</div>
                    <div class="domain-tape" data-index="${index}">
                        <span>Click to Guess</span>
                    </div>
                    <div class="domain-name" data-index="${index}">${domain.name}</div>
                    <div class="guess-input-container" data-index="${index}">
                        <input type="text" class="guess-input" placeholder="Enter your guess..." data-index="${index}">
                        <button class="guess-btn" data-index="${index}">Guess</button>
                    </div>
                `;
                domainContainer.appendChild(domainItem);
                
                // Add event listeners for tape and guess button
                const tape = domainItem.querySelector('.domain-tape');
                const guessBtn = domainItem.querySelector('.guess-btn');
                const guessInput = domainItem.querySelector('.guess-input');
                const inputContainer = domainItem.querySelector('.guess-input-container');
                const domainName = domainItem.querySelector('.domain-name');
                
                // Tape click to reveal input
                tape.addEventListener('click', function() {
                    if (!gameActive) return;
                    
                    // Hide tape and show input
                    tape.style.display = 'none';
                    inputContainer.classList.add('active');
                    guessInput.focus();
                });
                
                // Guess button click - ONE GUESS ONLY
                guessBtn.addEventListener('click', function() {
                    makeGuess(index);
                });
                
                // Enter key to submit guess
                guessInput.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') makeGuess(index);
                });
            });
        }
        
        function makeGuess(index) {
            if (!gameActive) return;
            
            const domainItem = document.querySelectorAll('.domain-item')[index];
            const guessInput = domainItem.querySelector('.guess-input');
            const domainName = domainItem.querySelector('.domain-name');
            const guessBtn = domainItem.querySelector('.guess-btn');
            const userGuess = guessInput.value.trim().toLowerCase();
            
            if (!userGuess) {
                alert('Please enter a guess!');
                return;
            }
            
            // DISABLE INPUT AFTER FIRST GUESS (ONE GUESS PER DOMAIN)
            guessInput.disabled = true;
            guessBtn.disabled = true;
            
            // Check if the guess matches ANY domain (not just the one at this position)
            let isCorrect = false;
            let matchedDomain = null;
            
            for (let domain of domainData) {
                const correctDomainName = domain.name.toLowerCase();
                if ((correctDomainName.includes(userGuess) || checkCloseMatch(userGuess, correctDomainName)) && 
                    !guessedDomains.includes(domain.name)) {
                    isCorrect = true;
                    matchedDomain = domain;
                    break;
                }
            }
            
            if (isCorrect && matchedDomain) {
                // Add points for correct guess
                score += matchedDomain.points;
                scoreDisplay.textContent = score;
                revealedDomains++;
                
                // Mark this domain as guessed
                guessedDomains.push(matchedDomain.name);
                
                // Find and reveal the actual domain that was guessed
                const actualDomainIndex = domains.findIndex(d => d.name === matchedDomain.name);
                if (actualDomainIndex !== -1) {
                    const actualDomainItem = document.querySelectorAll('.domain-item')[actualDomainIndex];
                    const actualDomainName = actualDomainItem.querySelector('.domain-name');
                    const actualGuessBtn = actualDomainItem.querySelector('.guess-btn');
                    const actualTape = actualDomainItem.querySelector('.domain-tape');
                    
                    // Reveal the actual domain
                    actualTape.style.display = 'none';
                    actualDomainName.classList.add('revealed');
                    actualGuessBtn.textContent = 'Correct!';
                    actualGuessBtn.classList.add('correct');
                    actualDomainItem.classList.add('correct');
                }
                
                // Show feedback for current input
                guessBtn.textContent = 'Correct!';
                guessBtn.classList.add('correct');
                domainItem.classList.add('correct');
                
                // Check if all domains are revealed
                if (revealedDomains === domains.length) {
                    endGame();
                }
            } else {
                // Incorrect guess - show "Wrong Answer"
                guessBtn.textContent = 'Wrong Answer';
                guessBtn.classList.add('incorrect');
                domainItem.classList.add('incorrect');
                
                // Check if all domains are revealed
                revealedDomains++;
                if (revealedDomains === domains.length) {
                    endGame();
                }
            }
        }
        
        function checkCloseMatch(guess, domainName) {
            // Simple fuzzy matching for common variations
            const mappings = {
                'ai': 'artificial intelligence',
                'ml': 'machine learning',
                'web': 'web development',
                'app': 'app development',
                'mobile': 'mobile app',
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
            timeLeft = 60;
            timerDisplay.textContent = `01:00`;
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
            
            // Reveal all domains that weren't guessed
            document.querySelectorAll('.domain-tape').forEach(tape => {
                tape.style.display = 'none';
            });
            document.querySelectorAll('.guess-input-container').forEach(container => {
                container.classList.add('active');
            });
            document.querySelectorAll('.domain-name').forEach(name => {
                name.classList.add('revealed');
            });
            
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
        }
        
        function submitAnswers() {
            endGame();
        }
        
        function resetGame() {
            // Reset game state
            timeLeft = 60;
            score = 0;
            gameActive = false;
            revealedDomains = 0;
            guessedDomains = [];
            
            // Reset UI
            timerDisplay.textContent = '01:00';
            timerDisplay.style.color = '#4d7fff';
            scoreDisplay.textContent = '0';
            
            // Show instructions again
            gameResult.style.display = 'none';
            gameInstructions.style.display = 'block';
        }
        
        function shuffleArray(array) {
            const newArray = [...array];
            for (let i = newArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
            }
            return newArray;
        }
        
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