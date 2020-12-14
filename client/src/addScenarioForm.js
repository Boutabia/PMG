import React, {useState, useEffect} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import "./components/Login.css";
import Jumbotron from 'react-bootstrap/Jumbotron';
import Axios from 'axios';
import authHeader from './services/auth-header';
import UserService from './services/user.service';

function AddScenarioForm(props) {

  const [scenarioNameState, setScenarioName] = useState("");

  const [descriptionState, setDescription] = useState("");
  const handleDescription = (e, editor) => {
    const data = editor.getData()
    setDescription(data)
  }

  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const updateCategory = (newValue) => {
    console.log('newValue: ', newValue)

    setSelectedCategories(prevArray => {
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

  useEffect(() => {
    UserService.getCategories().then(
      (response) => {
        setCategories([response.data]);
      })
      .catch((error) => {
        console.log(error);
    });
  }, []);

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
    console.log(selectedCategories);
    console.log(difficultyState);
    console.log(descriptionState);
    console.log(optionsState);
    console.log(checked);
    console.log(imageState);
    console.log(explanationState);

    const convertBoolean = val => val ? 1 : 0

    const scenarioData = {
      scenarioname: scenarioNameState,
      categories: selectedCategories,
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
      .post('http://localhost:3001/api/content/complete', scenarioData, {
        headers: authHeader()
      })
      .then (() => {
        alert("Scenario Added to DB");
        props.history.push("/scenarios");
        window.location.reload();
    });
  }

  return (
    <Jumbotron>
      <Form onSubmit={handleSubmit}>
        <h2>New Scenario</h2>
        <Form.Group>
          <Form.Label>SCENARIO NAME</Form.Label>
            <Form.Control
              type='text'
              name='scenarioName'
              value={scenarioNameState}
              required
              onChange={(e) => setScenarioName(e.target.value)}
              maxLength={60}
            />
        </Form.Group>
        <Form.Group>
          <Form.Label>CATEGORY
            <Form.Text className="text-muted">
              Select all that apply
            </Form.Text>
          </Form.Label>
          
          <Form.Control 
            as="select" multiple
            value={categories}
            required
            onChange={(e) => updateCategory(e.target.value)}
          >
            {categories.map(item => (
              <option
                key={item.id}
                value={item.value}
              >
                {item.categoryname}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>DIFFICULTY</Form.Label>
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
          <Form.Label>SCENARIO DESCRIPTION</Form.Label>
          <CKEditor
            editor={ClassicEditor}
            data={descriptionState}
            onChange={handleDescription}
            config={{
              toolbar: ['heading', '|', 'bold', 'italic', 'blockQuote', 'numberedList', 'bulletedList', 'imageUpload', 'insertTable', '|', 'undo', 'redo']
            }}
          />
        </Form.Group>

        <label>ANSWER OPTIONS
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

        <Form.Group>
          <Form.Label>EXPLANATION FOR CORRECT ANSWER</Form.Label>
          <CKEditor
            editor={ClassicEditor}
            data={explanationState}
            onChange={handleExplanation}
            config={{
              toolbar: ['heading', '|', 'bold', 'italic', 'blockQuote', 'numberedList', 'bulletedList', 'imageUpload', 'insertTable', '|', 'undo', 'redo']
            }}
          />
        </Form.Group>

        <Button variant="primary" type="submit">SAVE SCENARIO</Button>
      </Form>
    </Jumbotron>
  );
};

export default AddScenarioForm;