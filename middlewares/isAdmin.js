export default function isAdmin(req, res, next) {
    try {
        if (req.session.user.role === 'admin') {
            next();
        } else {
            res.status(401).json({message:"Only admins can see this page"})
        }
    } catch (error) {
        res.status(500).json({message:"There was an error, sorry!"})
    }
}