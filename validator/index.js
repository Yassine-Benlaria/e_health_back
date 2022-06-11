const specialities = ["Generalist",
    "Pédiatre",
    "Audioprothésiste",
    "Chirurgien",
    "Chirurgien Plastique Réparatrice et Esthétique",
    "Chirurgien Urologue",
    "Chirurgien cardiovasculaire et thoracique",
    "Chirurgien des mains",
    "Chirurgien digestif et viscéral",
    "Chirurgien maxillo-faciale",
    "Chirurgien orthopédique",
    "Chirurgien-Dentiste",
    "Conseillère conjugale et familiale",
    "Diététicien",
    "Ergothérapeute",
    "Infirmier",
    "Masseur-kinésithérapeute",
    "Médecin Addictologue",
    "Allergologue",
    "Anesthésiste-réanimateur",
    "Angiologue/phlébologue",
    "Biologiste médical",
    "Cardiologue",
    "Dermatologue",
    "Endocrinologue",
    "Esthétique",
    "Gynécologue",
    "Généraliste",
    "Généticien",
    "Gériatre",
    "Hématologue",
    "Hépato-gastro-entérologue",
    "Infectiologue",
    "Neurologue",
    "Néphrologue",
    "Obstétricien",
    "Oncologue",
    "Ophtalmologue",
    "Oto-rhino-laryngologiste",
    "Pneumologue",
    "Psychiatre",
    "Pédiatre",
    "Pédiatre gastroentérologue",
    "Pédiatre néonatologue",
    "Pédiatre pneumologue",
    "Pédopsychiatre",
    "Radiologue",
    "Radiothérapeute",
    "Rhumatologue",
    "Rééducateur",
    "Sexologue",
    "Tabacologue",
    "des expatriés",
    "du Sport",
    "interniste",
    "Neurochirurgien",
    "Nutritionniste",
    "Opticien-lunetier",
    "Orthodontiste",
    "Orthophoniste",
    "Orthoptiste",
    "Ostéopathe",
    "Pharmacien",
    "Physiothérapeute",
    "Psychologue",
    "Psychomotricien",
    "Psychothérapeute",
    "Pédicure - Podologue",
    "Sage-femme - Consultations gynécologiques",
    "Thérapeute",
];
exports.patientSignUpValidator = (req, res, next) => {

    //checking first name
    req.check("first_name", "first name should not be empty").notEmpty();
    req.check("first_name").isLength({
        min: 3,
        max: 32,
    }).withMessage("first name shoud be between 3 and 32 characters");

    //checking family name
    req.check("family_name", "family name should not be empty").notEmpty();
    req.check("first_name").isLength({
        min: 3,
        max: 32,
    }).withMessage("family name shoud be between 3 and 32 characters");

    //checking email
    req.check("email", "email is not valid")
        .isEmail();

    //checking password
    req.check("password")
        .isLength({ min: 8 })
        .withMessage("password must contain at least 8 characters");

    //checking gender
    req.check("gender", "gender is empty")
        .notEmpty()
        .isIn(["M", "F"])
        .withMessage("gender have only 2 options: M of F");

    //checking phone number
    req.check("phone", "phone number is not valid")
        .isMobilePhone();

    //checking birth date
    req.check("birth_date", "birth date is not valid.. valid format: YYYY-MM-DD")
        .isISO8601();

    //checking address
    req.check("address", "Address should not be empty").notEmpty()
        .isLength({ min: 4 }).withMessage("Address should have at least 4 characters.");
    //checking height
    req.check("height", "height should not be empty").notEmpty();

    //checking weight
    req.check("weight", "Weight should not be empty").notEmpty();

    //return the first error message
    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ err: firstError });
    }
    next();
}

exports.medecinSignUpValidator = (req, res, next) => {

    //checking first name
    req.check("first_name", "first name should not be empty").notEmpty();
    req.check("first_name").isLength({
        min: 3,
        max: 32,
    }).withMessage("first name shoud be between 3 and 32 characters");

    //checking family name
    req.check("family_name", "family name should not be empty").notEmpty();
    req.check("family_name").isLength({
        min: 3,
        max: 32,
    }).withMessage("family name shoud be between 3 and 32 characters");

    //checking email
    req.check("email", "email is not valid")
        .isEmail();

    //checking password
    req.check("password")
        .isLength({ min: 8 })
        .withMessage("password must contain at least 8 characters");

    //checking gender
    req.check("gender", "gender is empty")
        .notEmpty()
        .isIn(["M", "F"])
        .withMessage("gender have only 2 options: M of F");

    //checking phone number
    req.check("phone", "phone number is not valid")
        .isMobilePhone();

    //checking birth date
    req.check("birth_date", "birth date is not valid.. valid format: YYYY-MM-DD")
        .isISO8601();

    //speciality
    const speciality = req.body.speciality
    speciality.map(s => {
        console.log(s)

        if (!specialities.includes(s)) {
            return res.status(400).json({ error: `Speciality ${s} not found!` });
        }
    })

    //return the first error message
    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ err: firstError });
    }
    next();
}

exports.signInValidator = (req, res, next) => {

    //checking email
    req.check("email", "email should not be empty!!").notEmpty();
    req.check("email", "email is not valid")
        .isEmail();

    //checking password
    req.check("password", "Password should not be empty!")
        .notEmpty()
        .isLength({ min: 8 })
        .withMessage("password must contain at least 8 characters");

    //return the first error message
    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ err: firstError });
    }
    next();
}


////admin signup Validator
exports.adminSignUpValidator = (req, res, next) => {

    //checking first name
    req.check("first_name", "first name should not be empty").notEmpty();
    req.check("first_name").isLength({
        min: 3,
        max: 32,
    }).withMessage("first name shoud be between 3 and 32 characters");

    //checking family name
    req.check("family_name", "family name should not be empty").notEmpty();
    req.check("first_name").isLength({
        min: 3,
        max: 32,
    }).withMessage("family name shoud be between 3 and 32 characters");

    //checking email
    req.check("email", "email is not valid")
        .isEmail();

    //checking password
    req.check("password")
        .isLength({ min: 8 })
        .withMessage("password must contain at least 8 characters");

    //checking gender
    req.check("gender", "gender is empty")
        .notEmpty()
        .isIn(["M", "F"])
        .withMessage("gender have only 2 options: M of F");

    //checking phone number
    req.check("phone", "phone number is not valid")
        .isMobilePhone();

    //checking birth date
    req.check("birth_date", "birth date is not valid.. valid format: YYYY-MM-DD")
        .isISO8601();

    //checking address
    req.check("address", "Address should not be empty").notEmpty()
        .isLength({ min: 4 }).withMessage("Address should have at least 4 characters.");


    //return the first error message
    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ err: firstError });
    }
    next();
}