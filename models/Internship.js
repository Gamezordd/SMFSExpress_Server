const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InternshipModel = new Schema({
    name: { type: String, required: true},
	company: { type: String, required: true },
	details:{ type: String, required: true },
	class: { type: String, enum: [ 'Technical', 'Non-Technical' ]},
	pointsBreakup : [ { category: String, points: Number } ]
});

module.exports = mongoose.model('Internship', InternshipModel); 