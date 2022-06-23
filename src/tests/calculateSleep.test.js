import { calculateSleep } from '../controllers/sleep.js'

describe('Deve calcular as horas dormidas corretamente', () => {
  it('Deve retornar o valor correto se sleepHour > wakeUpHour', () => {

    const hour = {
      date: '01-01-2022',
      sleepHour: "22:00",
      wakeUpHour: "07:00",
      user: 'amanda'
    }

    const calculateHour = {
      date: '01-01-2022',
      sleepHour: "22:00",
      wakeUpHour: "07:00",
      user: 'amanda',
      hour: '9.00'
    }

    expect(calculateSleep(hour)).toEqual(calculateHour)
  })
})