export default function(req, res, next) {
    try {
        if (req.session.user) {
            next();
        } else {
            res.status(401).render("message", {
                title: "Oops.",
                message:"Only logged in users can see this page",
                link:"/",
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        });
    }
}