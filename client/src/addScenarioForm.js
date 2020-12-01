import React, {useState} from 'react';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Axios from 'axios';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

function AddScenarioForm() {

  const [scenarioNameState, setScenarioName] = useState("");

  const [descriptionState, setDescription] = useState("");
  const handleDescription = (e, editor) => {
    const data = editor.getData()
    setDescription(data)
  }

  const [categories] = useState([
    {id: 1, label: "Leadership", value: "Leadership"},
    {id: 2, label: "Meeting Practices", value: "Meeting Practices"},
    {id: 3, label: "Risk Management", value: "Risk Management"},
    {id: 4, label: "Scheduling", value: "Scheduling"},
    {id: 5, label: "Scrum", value: "Scrum"},
    {id: 6, label: "Teamwork", value: "Teamwork"}
  ]);
  const [categoryState, setCategory] = useState([]);

  const updateCategory = (newValue) => {
    console.log('newValue: ', newValue)

    setCategory(prevArray => {
      let valueExists = false

      prevArray.map(item => {
        console.log('prevArray: ', prevArray)
        if (item === newValue) {
          valueExists = true;
        }
      })
      if (valueExists) {
        let result = prevArray.filter(item => item !== newValue)
        console.log(result)
        return result
      } else {
        return [...prevArray, newValue]
      }
      
    })
  };

  const [difficultyLevels] = useState([
    {label: "Easy", value: "Easy"},
    {label: "Medium", value: "Medium"},
    {label: "Hard", value:"Hard"}
  ]);
  const [difficultyState, setDifficulty] = useState("Easy");

  const [optionsState, setOptions] = useState([
    {id: 1, name: "option1", label: "Option A", value: ""},
    {id: 2, name: "option2", label: "Option B", value: ""},
    {id: 3, name: "option3", label: "Option C", value: ""},
    {id: 4, name: "option4", label: "Option D", value: ""}
  ]);
  const handleOptionInput = index => event => {
    let newArr = [...optionsState];
    newArr[index].value = event.target.value;

    setOptions(newArr);
  };

  const [checked, setChecked] = useState({
    option1: false,
    option2: false,
    option3: false,
    option4: false,
  });

  const handleCheckbox = event => {
    setChecked({...checked, [event.target.name]: event.target.checked});
  };

  const [explanationState, setExplanation] = useState("");
  const handleExplanation = (e, editor) => {
    const data = editor.getData()
    setExplanation(data)
  }

  const [imageState, setImage] = useState({raw:""});

  const handleImage = e => {
    if (e.target.files.length && e.target.files[0].name.length <= 90) {
      setImage({
        raw: e.target.files[0]
      });
    } else {
        alert("Filename too long!")
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(scenarioNameState);
    console.log(categoryState);
    console.log(difficultyState);
    console.log(descriptionState);
    console.log(optionsState);
    console.log(checked);
    console.log(imageState);
    console.log(explanationState);

    const convertBoolean = val => val ? 1 : 0

    const scenarioData = {
      scenarioname: scenarioNameState,
      categories: categoryState,
      questiontext: descriptionState,
      option1: optionsState[0].value,
      option2: optionsState[1].value,
      option3: optionsState[2].value,
      option4: optionsState[3].value,
      correct1: convertBoolean(checked.option1),
      correct2: convertBoolean(checked.option2),
      correct3: convertBoolean(checked.option3),
      correct4: convertBoolean(checked.option4),
      picture: imageState,
      explanation: explanationState,
    }

    console.log(scenarioData);

    Axios
      .post('http://localhost:3001/api/insert', scenarioData)
      .then (() => {
        alert("Scenario Added to DB");
    });
  }

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <h2>New Scenario</h2>
        <Form.Group>
          <Form.Label>Scenario name</Form.Label>
            <Form.Control
              type='text'
              name='scenarioName'
              placeholder='Scenario name'
              value={scenarioNameState}
              required
              onChange={(e) => setScenarioName(e.target.value)}
              maxLength={60}
            />
        </Form.Group>
        <Form.Group>
          <Form.Label>Category
            <Form.Text className="text-muted">
              Select all that apply
            </Form.Text>
          </Form.Label>
          
          <Form.Control 
            as="select" multiple
            value={categoryState}
            required
            onChange={(e) => updateCategory(e.target.value)}
          >
            {categories.map(item => (
              <option
                key={item.id}
                value={item.value}
              >
                {item.label}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>Difficulty</Form.Label>
          <Form.Control 
            as="select"
            value={difficultyState}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            {difficultyLevels.map(item => (
              <option
                key={item.value}
                value={item.value}
              >
                {item.label}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>Scenario description</Form.Label>
          <CKEditor
            editor={ClassicEditor}
            data={descriptionState}
            onChange={handleDescription}
            config={{
              toolbar: ['heading', '|', 'bold', 'italic', 'blockQuote', 'numberedList', 'bulletedList', 'imageUpload', 'insertTable', '|', 'undo', 'redo']
            }}
          />
          {/* <Form.Control as="textarea" rows={5}
            name="description"
            value={descriptionState}
            onChange={(e) => setDescription(e.target.value)}
            required
            maxLength={300}
          /> */}
        </Form.Group>

        <label>Answer options
          <Form.Text className="text-muted">
            Check correct answers
          </Form.Text>
        </label>

        <Form.Group controlId="formBasicCheckbox">
          {optionsState.map((option, index) => (
            <InputGroup key={option.id}>
              <InputGroup size="sm" className="mb-3" key={option.id}>
                <InputGroup.Prepend key={option.id}>
                  <InputGroup.Checkbox
                    name={option.name}
                    key={option.id}
                    arial-label="Checkbox for following text input"
                    type="checkbox" 
                    label={option.label}
                    checked={checked[option.name]}
                    onChange={handleCheckbox}
                  />
                  <InputGroup.Text key={option.label}>{option.label}:</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  key={option.name}
                  aria-label="Text input with checkbox"
                  type="text"
                  value={option.value}
                  onChange={handleOptionInput(index)}
                  aria-describedby="basic-addon2"
                  maxLength={140}
                  required
                />
              </InputGroup>
            </InputGroup>
          ))}
        </Form.Group>

        {/* <Form.Group>
          <Form.Label>Explanation for correct answer</Form.Label>
              <Form.Control as="textarea" rows={3}
                name="explanantion"
                value={explanationState}
                onChange={(e) => setExplanation(e.target.value)}
                required
                maxLength={300}
              />
        </Form.Group> */}

        <Form.Group>
          <Form.Label>Explanation for correct answer</Form.Label>
          <CKEditor
            editor={ClassicEditor}
            data={explanationState}
            onChange={handleExplanation}
            config={{
              toolbar: ['heading', '|', 'bold', 'italic', 'blockQuote', 'numberedList', 'bulletedList', 'imageUpload', 'insertTable', '|', 'undo', 'redo']
            }}
          />
        </Form.Group>

        <Form.Group>
              <Form.File 
                id="FormControlImage" 
                label="Upload image"
                onChange={handleImage}
              />
        </Form.Group>
        <Button variant="primary" type="submit">Save Scenario</Button>
      </Form>
    </Container>
  );
}


export default AddScenarioForm;