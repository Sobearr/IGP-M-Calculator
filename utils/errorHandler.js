export class ErrorHandler {
  constructor(error) {
    this.error = error;
  }

  getMessage() {
    if (this.error.code === 'ENOENT') {
      console.log(
        'Por favor certifique-se de que o caminho do arquivo está correto.'
      );
    } else {
      console.log(this.error.message);
    }
  }
}
