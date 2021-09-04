export default function(req, res, next) {
    try {
        if (req.session.user) {
            next();
        } else {
            res.status(401).send({message:"Only logged in users can see this page"})
        }
    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        });
    }
}