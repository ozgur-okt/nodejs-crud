const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    count: tours.length,
    data: {
      tours,
    },
  });
};

const getOneTour = (req, res) => {
  const id = parseInt(req.params.id);
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  res.status(200).json({
    status: 'success',
    data: { tour },
  });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: tours,
      });
    }
  );
};

const updateTour = (req, res) => {
  const id = parseInt(req.params.id);
  if (!tours[id]) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  // we get data with id but do process with index below
  // id and index may not the same
  //tours[id] = { ...tours[id], ...req.body };
  // a solution:

  for (let i = 0; i < tours.length; i++) {
    if(tours[i].id === id){
      tours[i] = { ...tours[i], ...req.body };
      //console.log(tours[i])
    }
  }

  res.status(204).json({
    status: 'success',
    updatedData: tours[id],
  });
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => console.log(err)
  );
};

const deleteTour = (req, res) => {
  const id = req.params.id * 1;
  if (!tours[id]) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  const newList = tours.filter((el) => el.id !== id);
  fs.writeFileSync(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(newList)
  );
  //console.log(newList);
  res.status(204).json({
    status: 'success - deleted',
    deletedData: tours[id],
  });
};

//app.get('/api/v1/tours', getTours);
app.get('/api/v1/tours/:id', getOneTour);
//app.post('/api/v1/tours', createTour);
app.patch('/api/v1/tours/:id', updateTour);
app.delete('/api/v1/tours/:id', deleteTour);

app.route('/api/v1/tours').get(getTours).post(createTour);
app
  .route('/api/v1/tours/:id')
  .get(getOneTour)
  .patch(updateTour)
  .delete(deleteTour);

const port = 3000;
app.listen(port, () => {
  console.log(`App running on -- ${port} --`);
});
