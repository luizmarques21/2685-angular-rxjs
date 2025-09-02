import {Component} from '@angular/core';
import {LivroService} from "../../service/livro.service";
import {debounceTime, filter, map, switchMap, tap} from "rxjs";
import {Item} from "../../models/interfaces";
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

  constructor(private service: LivroService) {
  }

  livrosEncontrados$ = this.campoBusca.valueChanges
    .pipe(
      debounceTime(PAUSA),
      filter((valorDigitado) => valorDigitado.length >= 3),
      tap(() => console.log('Fluxo inicial')),
      switchMap((valorDigitado) => this.service.buscar((valorDigitado))),
      tap((retornoAPI) => console.log(retornoAPI)),
      map((items) => this.livrosResultadoParaLivros(items))
    );

  livrosResultadoParaLivros(items: Item[]): LivroVolumeInfo[] {
    return items.map(item => {
      return new LivroVolumeInfo(item);
    });
  }

}



