import { fireEvent, screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import userEvent from '@testing-library/user-event'
import { ROUTES } from "../constants/routes"
import { localStorageMock } from "../__mocks__/localStorage.js"
import firebase from "../__mocks__/firebase"

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then I check if I have loaded a file", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
      //gère les routes
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const firestore = null
      //instance de la class newbill
      const newBill = new NewBill({
        document, onNavigate, firestore, localStorage: window.localStorage
      })
      //je créée un fichier
      const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' })
      //je récupére l'input file
      const input = screen.getByTestId('file')
      //j'espionne le comportement de la fonction handleChange de newbill 
      const handleChangeFile = jest.fn(newBill.handleChangeFile)
      //je créer l'évenement sur l'input
      input.addEventListener('change', handleChangeFile)
      //je simule l"évenement
      userEvent.upload(input , { target : {files: [file]}})
      //je vérifie si la fonction handleChangefile a bien été appelé
      expect(handleChangeFile).toHaveBeenCalled()

    })

    test("Then I check if the form has been sent", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      const user = JSON.stringify({
        type: 'Employee'
      })
      window.localStorage.setItem('user', user)

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const firestore = null
      const newBill = new NewBill({
        document, onNavigate, firestore, localStorage: window.localStorage
      })

      const form = screen.getByTestId("form-new-bill")
      const handleSubmit = jest.fn(newBill.handleSubmit)  
  
      form.addEventListener("submit", handleSubmit)
      fireEvent.submit(form) 
      expect(form).toBeTruthy()
      expect(handleSubmit).toHaveBeenCalled()
    })
  })
})


// test d'intégration GET
describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("fetches bills from mock API GET", async () => {
      const getSpy = jest.spyOn(firebase, "get")
       const bills = await firebase.get()
       expect(getSpy).toHaveBeenCalledTimes(1)
       expect(bills.data.length).toBe(4)
    })
  })
})