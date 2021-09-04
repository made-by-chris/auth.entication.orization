export default function(req, res, next) {
    try {
        const primary = req.session.user.primaryContact
        const value = req.session.user[`${primary}Confirmed`]
        if (value) {
            next();
        } else {
            res.status(401).json({message:`Please confirm your ${primary} to continue.`})
        }
    } catch (error) {
        res.status(500).json({message:"There was an error, sorry!"})
    }
}