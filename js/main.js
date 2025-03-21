Vue.component('column', {
    props: {
      column: { required: true },
      columnIndex: { required: true },
      isFirstColumnBlocked: { default: false }
    },
  
    mounted() {
      localStorage.clear(); // Для тестирования, в рабочей версии можно убрать
    },
    
    template: `
      <div class="column">
        <h2>{{ column.title }} ({{ column.cards.length }})</h2>
        <card-component 
          v-for="(card, index) in column.cards" 
          :key="card.id" 
          :card="card" 
          :card-index="index"
          :column-index="columnIndex"
          @toggle-task="$emit('toggle-task', columnIndex, index)"
        ></card-component>
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
      columnIndex: { required: true } // Индекс столбца
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
        ],
        showModal: false,         
        modalColumnIndex: null,   // Индекс колонки, куда добавляем карточку
        newCardTitle: "",         
        newCardTasks: ["", "", ""] 
      };
    },
    computed: {
      isFirstColumnBlocked() {
        return this.columns[1].cards.length >= 5;
      }
    },
    methods: {
      addCard(columnIndex) { // модальное окно
        this.modalColumnIndex = columnIndex;
        this.newCardTitle = "";
        this.newCardTasks = ["", "", ""];
        this.showModal = true;
      },
      closeModal() {
        this.showModal = false;
      },
      saveNewCard() {
        if (!this.newCardTitle.trim()) {
          alert("Введите название карточки.");
          return;
        }
        const tasks = this.newCardTasks.map(task => task.trim());
        if (tasks.some(task => !task) || tasks.length !== 3) {
          alert("Заполните все 3 задачи.");
          return;
        }
        const newCard = {
          id: Date.now(),
          title: this.newCardTitle.trim(),
          tasks: tasks.map(text => ({ text, completed: false }))
        };
        this.columns[this.modalColumnIndex].cards.push(newCard);
        this.saveData();
        this.showModal = false;
      },
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
  