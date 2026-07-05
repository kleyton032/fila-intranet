export class FilaConsultasExamesEntity {
  posicao: number;
  idPaciente: string | number;
  nomePaciente: string;
  sexoPaciente: string;
  nascimentoPaciente: string;
  idadePaciente: number;
  cnsPaciente: string;
  cidadePaciente: string;

  constructor(partial: Partial<FilaConsultasExamesEntity>) {
    Object.assign(this, partial);
  }
}
