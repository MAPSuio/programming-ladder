Problems = new Mongo.Collection('problems');

ProblemsSchema = new SimpleSchema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    solution: {
        type: String
    },
    maxScore: {
        type: Number,
        min: 0,
        defaultValue: 10,
        label: 'The maximum number of points attainable for this problem',
        custom: function () {
            if (this.value < this.field('minScore').value) {
                return 'Must be greater than or equal to the minimum score';
            }
        }
    },
    minScore: {
        type: Number,
        min: 0,
        defaultValue: 2,
        label: 'The minimum number of points attainable for this problem'
    },
    createdAt: {
        type: Date,
        autoValue: function() {
            if (this.isInsert) {
                return new Date;
            } else if (this.isUpsert) {
                return {$setOnInsert: new Date};
            } else {
                this.unset();
            }
        }
    },
    draft: {
        type: Boolean,
        defaultValue: true,
        label: "Drafts aren't considered published, and will only be visible to admins."
    },
    activeFrom: {
        type: Date,
        defaultValue: new Date,
        label: 'The time this problem is published and visible to the public.'
    },
    activeTo: {
        type: Date,
        optional: true,
        custom: function() {
            if (this.value && this.value < this.field('activeFrom').value) {
                return 'Must be greater than or equal to activeFrom';
            }
        }
    },
    answers: {
        type: [Object],
        defaultValue: []
    },
    'answers.$.userId': {
        type: String
    },
    'answers.$.score': {
        type: Number,
        min: 0
    },
    'answers.$.solved': {
        type: Boolean
    }
});

Problems.attachSchema(ProblemsSchema);



Problems.allow({
    insert: isAdminById,
    update: isAdminById,
    remove: isAdminById
});



//When a problem is deleted, decrement the users' scores and solve count accordingly
if (Meteor.isServer) {
    Problems.after.remove(function (userId, problem) {
        var toDecrement = _.filter(problem.answers, function (answer){ return answer.solved == true; });

        toDecrement.forEach(function (answer) {
            Meteor.users.update(answer.userId, {$inc: {score: -answer.score, solved: -1}});
        });
    });
}
