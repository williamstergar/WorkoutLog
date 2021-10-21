let Express = require('express');
let router = Express.Router();
let validateJWT = require('../middleware/validate-jwt');

const { LogModel } = require('../models');

router.get('/practice', validateJWT, (req, res) => {
    res.send('Hey!! This is a practice route!')
});

router.post('/create', validateJWT, async (req, res) => {
    const { description, definition, result } = req.body.log;
    const { id } = req.user;
    const logEntry = {
        description,
        definition,
        result,
        owner_id: id
    }
    try {
        const newLog = await LogModel.create(logEntry);
        res.status(200).json(newLog);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.get('/mine/', validateJWT, async (req, res) => {
    const { id } = req.user;
    try {
        const userLog = await LogModel.findAll({
            where: {
                owner_id: id
            }
        });
        res.status(200).json(userLog);
    } catch (err) {
        res.status(500).json({ error: err })
    }
});
router.get('/mine/:id', validateJWT, async (req, res) => {
    const { id } = req.params;

    try {

        const locatedLog = await LogModel.findAll({
            where: {
                id: id,
                owner_id: req.user.id
            },
        });
        res
            .status(200)
            .json({ message: 'Log successfully retrieved', locatedLog });
    } catch (err) {
        res.status(500).json({ message: `Failed to retrieve log: ${err}` });
    }
});

router.put('/update/:id', validateJWT, async (req, res) => {
    const { description, definition, result } = req.body.log;

    try {
        const updateLog = await LogModel.update({ description, definition, result }, { where: { id: req.params.id, owner_id: req.user.id } });
        res.status(200).json({ message: 'updated successfully', updateLog });
    } catch (error) {
        res.status(500).json({ message: 'update failed', error });
    }
});
    router.delete('/delete/:id', validateJWT, async (req, res) => {
        const userId = req.user.id;
        const logId = req.params.id;

        try {
            const query = {
                where: {
                    id: logId,
                    owner_id: userId
                }
            };
            await LogModel.destroy(query);
            res.status(200).json({ message: 'Log has successfully been deleted' });
        } catch (err) {
            res.status(500).json({
                message: 'Failed to delete log'
            });
        }
    });

    // router.get('/about', (req, res) => {
    //     res.send('This is the about route!');
    // }); 

    module.exports = router;