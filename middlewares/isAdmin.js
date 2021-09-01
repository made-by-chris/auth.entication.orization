export default function isAdmin(req, res, next) {
    try {
        if (req.session.user.role === 'admin') {
            next();
        } else {
            res.status(401).render("message", {
                title: "Oops.",
                message:"Only admins can see this page",
                link:"/",
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error'
        });
    }
}