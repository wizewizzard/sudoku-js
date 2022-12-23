const difficultyRanging = [
    { code: 'veasy', label: "Very easy", from: 50, to: 81 },
    { code: 'easy', label: "Easy", from: 40, to: 49 },
    { code: 'normal', label: "Normal", from: 30, to: 39 },
    { code: 'hard', label: "Hard", from: 25, to: 29 },
    { code: 'vhard', label: "Very Hard", from: 0, to: 24 }
];

function getDifficulty(value){
    if( value > 81 || value < 0)
        throw new Error('Invalid value given');
    return difficultyRanging.find(d => (d.from <= value && d.to >= value));
}

export default getDifficulty;