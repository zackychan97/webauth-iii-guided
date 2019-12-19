/// Step 5 - An object we export with the secrets and it has a property called jwtSecret that if it is provided say in production, its gonna be a diff JWT_SECRET than say the one in development and we also provide a simple fallback during development

// Step 6 would be to go into our auth-router.js and import it at the top

module.exports = {
    jwtSecret: process.env.JWT_SECRET || 'keep it secret, keep it safe!'
}