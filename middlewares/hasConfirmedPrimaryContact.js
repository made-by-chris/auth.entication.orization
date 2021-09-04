export default function(req, res, next) {
    try {
        const primary = req.session.user.primaryContact
        const value = req.session.user[`${primary}Confirmed`]
        if (value) {
            next();
        } else {
            res.status(401).render("message", {
                title: "Oops.",
                message:`Please confirm your ${primary} to continue.`,
                link:"/",
            });
        }
    } catch (error) {
        res.status(500).render("message", {
            title: "Oops.",
            message:"There was an error, sorry!",
            link:"/",
        });
    }
}