Vue.component('column', {
    props: {
      column: { required: true },
      columnIndex: { required: true },
      isFirstColumnBlocked: { default: false }
    },
    template: `
      <div class="column">
        <h2>{{ column.title }} ({{ column.cards.length }})</h2>
        <!-- Здесь позже будут карточки -->
        <button v-if="canAddCard" @click="$emit('add-card', columnIndex)">
          Добавить карточку
        </button>
      </div>
    `,
    computed: {
      canAddCard() {
        return this.columnIndex === 0 && this.column.cards.length < 3 && !this.isFirstColumnBlocked;
      }
    }
  });
  
  const app = new Vue({
    el: '#app',
    data() {
      return {
        columns: [
          { title: "Новые", cards: [] },
          { title: "Выполняются", cards: [] },
          { title: "Завершенные", cards: [] }
        ]
      };
    }
  });
  