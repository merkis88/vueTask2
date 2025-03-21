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

  Vue.component('card-component', {
    props: {
      card: { required: true },
      cardIndex: { required: true },
      columnIndex: { required: true }
    },
    template: `
      <div class="card">
        <h3>{{ card.title }}</h3>
        <ul>
          <li v-for="(task, index) in card.tasks" :key="index">
            <label>
              <input type="checkbox" v-model="task.completed" @change="onTaskToggle">
              {{ task.text }}
            </label>
          </li>
        </ul>
      </div>
    `,
    methods: {
      onTaskToggle() {
        this.$emit('toggle-task', this.columnIndex, this.cardIndex);
      }
    }
  });
  
  
  const app = new Vue({
    el: '#app',
    data() {
      return {
        columns: JSON.parse(localStorage.getItem("columns")) || [
          { title: "Новые", cards: [] },
          { title: "Выполняются", cards: [] },
          { title: "Завершенные", cards: [] }
        ]
      };
    },
    computed: {
      isFirstColumnBlocked() {
        return this.columns[1].cards.length >= 5;
      }
    }
  });
  