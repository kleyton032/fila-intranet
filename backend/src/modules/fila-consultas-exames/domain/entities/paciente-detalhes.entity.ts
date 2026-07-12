export class PacienteDetalhesEntity {
  posicao: number;
  itemAgendamento: string;
  dataEntrada: string;
  idAtendimento: string | number | null;
  prioridade: string;
  situacao: string;
  dataAgendamento: string | null;
  dataRealizacao: string | null;
  dataRetorno: string | null;

  constructor(partial: Partial<PacienteDetalhesEntity>) {
    Object.assign(this, partial);
  }
}
