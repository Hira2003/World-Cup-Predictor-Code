let teams = [];

fetch("teams.json")
.then(response => response.json())
.then(data => {

    teams = data;

    const teamA = document.getElementById("teamA");
    const teamB = document.getElementById("teamB");

    teams.forEach(team => {

        teamA.innerHTML += `
            <option value="${team.name}">
                ${team.name}
            </option>
        `;

        teamB.innerHTML += `
            <option value="${team.name}">
                ${team.name}
            </option>
        `;
    });

});

function formScore(form){

    let score = 0;

    for(let result of form){

        if(result === "W")
            score += 3;

        else if(result === "D")
            score += 1;
    }

    return score;
}

function calculatePower(team){

    const eloPart =
        (team.elo / 2200) * 70;

    const formPart =
        (formScore(team.form) / 15) * 20;

    const attackPart =
        (team.goalsScoredLast5 / 15) * 10;

    return eloPart + formPart + attackPart;
}

function winProbability(powerA,powerB){

    return powerA / (powerA + powerB);
}

function generateGoals(power){

    return Math.floor(
        Math.random() * (power / 25)
    );
}

function predictMatch(){

    const selectedA =
        document.getElementById("teamA").value;

    const selectedB =
        document.getElementById("teamB").value;

    if(selectedA === selectedB){

        alert("Choose two different teams");

        return;
    }

    const teamA =
        teams.find(t => t.name === selectedA);

    const teamB =
        teams.find(t => t.name === selectedB);

    const powerA =
        calculatePower(teamA);

    const powerB =
        calculatePower(teamB);

    const chanceA =
        winProbability(powerA,powerB);

    const chanceB = 1 - chanceA;
  
    let goalsA =
        generateGoals(powerA);

    let goalsB =
        generateGoals(powerB);

    if(powerA > powerB && Math.random() < 0.5)
        goalsA++;

    if(powerB > powerA && Math.random() < 0.5)
        goalsB++;

    let winner;

    if(goalsA > goalsB)
        winner = teamA.name;

    else if(goalsB > goalsA)
        winner = teamB.name;

    else
        winner = "Draw";

    document.getElementById("result").innerHTML = `

        <h2>${teamA.name} ${goalsA} - ${goalsB} ${teamB.name}</h2>

        <p><b>Winner:</b> ${winner}</p>

        <p>${teamA.name} Power:
        ${powerA.toFixed(1)}</p>

        <p>${teamB.name} Power:
        ${powerB.toFixed(1)}</p>

        <p>${teamA.name} Win Chance:
        ${(chanceA*100).toFixed(1)}%</p>

        <p>${teamB.name} Win Chance:
        ${(chanceB*100).toFixed(1)}%</p>

    `;
}
