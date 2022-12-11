const express = require('express');

const app = express();

const db = require('./models');  // models/index.js 파일을 찾아서 실행함

const { Member } = db;

//middleware -> POST의 body 정보를 담기 위한 장치
app.use(express.json());

app.get('/', (req, res) => {
    res.send('URL should contain /api/..');
});

// 쿼리로 받은 것으로 특정 부서 검색
app.get('/api/members', async (req, res) => {
    const { team } = req.query;
    if (team) {
        const teamMembers = await Member.findAll({
            where: { team },
            // order: [
            //     ['admissionDate', 'DESC']
            // ]
        });
        res.send(teamMembers);
    } else {
        const members = await Member.findAll({
            // order: [
            //     ['admissionDate', 'DESC']
            // ]
        });
        res.send(members);
    }
});

// params로 받은 것으로 특정 idx 인물 검색
app.get('/api/members/:id', async (req, res) => {
    const { id } = req.params;
    const member = await Member.findOne({ where: { id }});
    if (member) {
        res.send(member);
    } else {
        res.status(404).send({ message: 'There is no such member'});
    }
});

// POST 메소드로 멤버 추가하기
app.post('/api/members', async (req, res) => {
    const newMember = req.body;
    const member = Member.build(newMember);
    await member.save();
    res.send(member);
});

// PUT 메소드로 멤버 정보 수정하기 1
// app.put('/api/members/:id', async (req, res) => {
//     const { id } = req.params;
//     const newInfo = req.body;
//     const result = await Member.update(newInfo, {where: {id}})
//     if (result[0]) {
//         res.send({ message: `${result[0]} row(s) affected`});
//     } else {
//         res.status(404).send({ message: 'There is no member with the id!' });
//     }
// });

// PUT 메소드로 멤버 정보 수정하기 2
app.put('/api/members/:id', async (req, res) => {
    const { id } = req.params;
    const newInfo = req.body;
    const member = await Member.findOne({ where: { id } });
    if (member) {
        Object.keys(newInfo).forEach((prop) => {
            member[prop] = newInfo[prop];
        });
        await member.save()
        res.send(member);
    } else {
        res.status(404).send({ message: 'There is no member with the id!' });
    }
});


// DELETE 메소드로 멤머 정보 삭제하기 1
// app.delete('/api/members/:id', async (req, res) => {
//     const { id } = req.params;
//     const deletedCount = await Member.destroy({ where: { id } });
//     if (deletedCount) {
//         res.send({ message: `${deletedCount} row(s) deleted` });
//     } else {
//         res.status(404).send({ message: 'There is no member with the id!' });
//     }
// });

// DELETE 메소드로 멤머 정보 삭제하기 2
app.delete('/api/members/:id', async (req, res) => {
    const { id } = req.params;
    const member = await Member.findOne({ where: { id } });
    if (member) {
        const result = await member.destroy();
        res.send({ message: `1 row(s) deleted`})
    } else {
        res.status(404).send({ message: 'There is no member with the id!' });
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log('server is listening...')
});
