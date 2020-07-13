import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "historyTitle",
})
export class HistoryTitlePipe implements PipeTransform {
  transform(value: string) {
    const characters = value.split("");
    characters[0] = characters[0].toUpperCase();
    return characters.reduce((acc, char) => (acc += char === char.toUpperCase() ? " " + char : char));
  }
}
