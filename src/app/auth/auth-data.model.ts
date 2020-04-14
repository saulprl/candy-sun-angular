export class AuthData {
  private name: string;
  private surname: string;
  private dob: Date;
  private email: string;
  private password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }

  public setName(name: string) {
    this.name = name;
  }

  public setSurname(surname: string) {
    this.surname = surname;
  }

  public setDob(dob: Date) {
    this.dob = dob;
  }

  public setEmail(email: string) {
    this.email = email;
  }

  public setPassword(password: string) {
    this.password = password;
  }
}
