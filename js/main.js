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
    },
    methods: {
        toggleTask(columnIndex, cardIndex) {
          const card = this.columns[columnIndex].cards[cardIndex];
          const completedCount = card.tasks.filter(task => task.completed).length;
          const progress = completedCount / card.tasks.length;
      
          if (columnIndex === 0 && progress > 0.5 && this.columns[1].cards.length < 5) {
            this.moveCard(columnIndex, cardIndex, 1);
          } 
          else if (progress === 1 && columnIndex !== 2) {
            this.moveCard(columnIndex, cardIndex, 2);
          } 
          else if (columnIndex === 1 && progress < 0.5) {
            this.moveCard(columnIndex, cardIndex, 0);
          } 
          else if (columnIndex === 2 && progress < 1 && this.columns[1].cards.length < 5) {
            this.moveCard(columnIndex, cardIndex, 1);
          }
          this.saveData();
        },
        moveCard(fromColumn, cardIndex, toColumn) {
          const card = this.columns[fromColumn].cards.splice(cardIndex, 1)[0];
          this.columns[toColumn].cards.push(card);
        },
        saveData() {
          localStorage.setItem("columns", JSON.stringify(this.columns));
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
    }, 
    data() {
        return {
          columns: JSON.parse(localStorage.getItem("columns")) || [
            { title: "Новые", cards: [] },
            { title: "Выполняются", cards: [] },
            { title: "Завершенные", cards: [] }
          ],
          showModal: false,         
          modalColumnIndex: null,   
          newCardTitle: "",         
          newCardTasks: ["", "", ""] 
        };
      },
      
  });
  