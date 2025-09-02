import {Component} from '@angular/core';
import {LivroService} from "../../service/livro.service";
import {catchError, debounceTime, filter, map, switchMap, throwError} from "rxjs";
import {Item, LivrosResultado} from "../../models/interfaces";
import {LivroVolumeInfo} from "../../models/livroVolumeInfo";
import {FormControl} from "@angular/forms";

const PAUSA = 300;

@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css']
})
export class ListaLivrosComponent {

  campoBusca = new FormControl();
  mensagemErro = '';
  livrosResultado: LivrosResultado;

  constructor(private service: LivroService) {
  }

  livrosEncontrados$ = this.campoBusca.valueChanges
    .pipe(
      debounceTime(PAUSA),
      filter((valorDigitado) => valorDigitado.length >= 3),
      switchMap((valorDigitado) => this.service.buscar((valorDigitado))),
      map((resultado) => this.livrosResultado = resultado),
      map((resultado) => resultado.items ?? []),
      map((items) => this.livrosResultadoParaLivros(items)),
      catchError((erro) => {
        console.log(erro);
        return throwError(() => new Error(this.mensagemErro = 'Ops ocorreu um erro. Recarregue a aplicação'));
      })
    );

  livrosResultadoParaLivros(items: Item[]): LivroVolumeInfo[] {
    return items.map(item => {
      return new LivroVolumeInfo(item);
    });
  }

}



