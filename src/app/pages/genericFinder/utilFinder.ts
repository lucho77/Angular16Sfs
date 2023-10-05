import { FinderGenericDTO } from '../../_models/finderGenericDTO';
import { FinderParamsDTO } from '../../_models/finderParamsDTO';
import { HeaderDTO } from '../../_models/headerDTO';

export function inicializarFinder(finder: FinderParamsDTO) {
    finder.dataSource = '';
    finder.username = '';
    finder.webServicesAddress = '';
    finder.modelPackage = '';
    finder.entityClass = '';
    finder.viewName = '';
    finder.nameParam = '';
    finder.firstRow = 0;
    finder.maxRows = 100;
    finder.entity = '';
    finder.vista = '';
    finder.methodName = '';
    finder.globalParam = '';
    finder.typeMethodFinder = false;
    finder.listGlobales = [];

    const  f = {} as FinderGenericDTO;

    f.type = '';
    f.label = '';
    f.atribute = '';
    f.value = '';
    f.globalParam = '';
    f.type = '';
    f.parametrosFinderMetodo = [];
    f.filtrosDependencia = [];
    finder.finderGenericDTO = f;

  }

  export function getData(datos: any, columns: HeaderDTO[]) {

    // tslint:disable-next-line:prefer-const
    let  data = [];
    let post = {};
    console.log('datos antes de inicializar');
    console.log(datos);
    // console.log('columnas length ' + columns.length);
    for (let i = 0; i < datos.length; i++) {
      for (let j = 0; j < columns.length; j++) {
        post[columns[j].name] = datos[i][j].value;
      }
      // post['metodoDTO'] = datos[i].metodoDTO;
      // console.log('post' + JSON.stringify(post));
     // console.log(post);

      data.push(post);
      post = {};
    }
    // console.log('la data es...');

    // console.log( data);
    return data;
  }
