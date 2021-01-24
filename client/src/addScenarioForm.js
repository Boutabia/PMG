import React, {useState, useEffect} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import "./components/Login.css";
import Jumbotron from 'react-bootstrap/Jumbotron';
import scenarioService from "./services/scenarios";
import AuthService from "./services/auth.service";
import { Redirect } from "react-router-dom";

const required = () => {
    return (
      alert("Select at least one category.")
    )
}

function AddScenarioForm(props) {
  const [message, setMessage] = useState("");

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

      prevArray.forEach(item => {
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
    scenarioService.getCategories().then(
      (response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.log(error);
    });
  }, []);

  const [difficultyLevels] = useState([
    {label: "Easy", value: 1},
    {label: "Medium", value: 2},
    {label: "Hard", value: 3}
  ]);
  const [difficultyState, setDifficulty] = useState(1);

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

  const [file, setFile] = useState("");
  const [imagePathState, setImagePath] = useState("");

  const handleImage = e => {
    if (e.target.files.length && e.target.files[0].name.length <= 90) {
      setImagePath(e.target.files[0].name);
    } else {
        alert("Filename too long!")
    }
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(scenarioNameState);
    console.log(selectedCategories);
    console.log(difficultyState);
    console.log(descriptionState);
    console.log(optionsState);
    console.log(checked);
    console.log(imagePathState);
    console.log(explanationState);
    console.log("KUVA", file);

    if (selectedCategories.length === 0 || descriptionState.length === 0) {
      required()
    } else {

      const convertBoolean = val => val ? 1 : 0

      const scenarioData = {
        scenarioNameVar: scenarioNameState,
        questionTypeVar: 1,
        questionTextVar: descriptionState,
        pictureVar: imagePathState,
        questionOption1Var: optionsState[0].value,
        questionOption2Var: optionsState[1].value,
        questionOption3Var: optionsState[2].value,
        questionOption4Var: optionsState[3].value,
        questionCorrect1Var: convertBoolean(checked.option1),
        questionCorrect2Var: convertBoolean(checked.option2),
        questionCorrect3Var: convertBoolean(checked.option3),
        questionCorrect4Var: convertBoolean(checked.option4),
        questionExplanationVar: explanationState,
        scenarioDifficultyVar: difficultyState,
        scenarioCategoryVar: selectedCategories
      }
  
      console.log(scenarioData);

      const fileData = new FormData();
      fileData.append("file", file);
      console.log("image", fileData);

      scenarioService
        .saveImage(fileData)
        .then (() => {

        })
        .catch(error => {
          console.log(error);
        });

      scenarioService
        .createScenario(scenarioData)
        .then (() => {
          alert("New scenario added successfully.");
          props.history.push("/scenarios");
          window.location.reload();
      });
      
    }
    
  }

  AuthService.getExpiration()
  if (!AuthService.getCurrentUser()) {
    return <Redirect to="/login" />;
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
          
          {categories.map(item => (
            <Form.Group key={item.categoryid} controlId="formBasicCheckbox">
              <Form.Check
                id={item.categoryid}
                label={item.categoryname}
                key={item.categoryid}
                value={item.categoryid}
                onChange={(e) => updateCategory(e.target.value)}
              />
            </Form.Group>
          ))}
          

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
              toolbar: ['heading', '|', 'bold', 'italic', 'blockQuote', 'numberedList', 'bulletedList', 'insertTable', '|', 'undo', 'redo']
            }}
          />
        </Form.Group>

        <Form.Group>
          <Form.File 
            id="exampleFormControlFile1" 
            label="Add image to description" 
            onChange={handleImage}  
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
              toolbar: ['heading', '|', 'bold', 'italic', 'blockQuote', 'numberedList', 'bulletedList', 'insertTable', '|', 'undo', 'redo']
            }}
          />
        </Form.Group>

        {message && (
            <div className="form-group">
              <div className="alert alert-danger" role="alert">
                {message}
              </div>
            </div>
          )}

        <Button variant="primary" type="submit">SAVE SCENARIO</Button>
      </Form>
    </Jumbotron>
  );
};

export default AddScenarioForm;